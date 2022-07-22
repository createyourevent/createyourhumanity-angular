import { resolve } from '@angular/compiler-cli/private/localize';
import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { FormulaData } from 'app/entities/formula-data/formula-data.model';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { LoginService } from 'app/login/login.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { Item } from 'app/profile/profile.component';
import dayjs from 'dayjs';
import { LayoutManager } from '@wisemapping/mindplot';
import { Designer, Topic } from '@wisemapping/mindplot';
import { MatExpansionPanel, MatAccordion } from '@angular/material/expansion';
import { Account } from 'app/core/auth/account.model';
import SearchByModelDataViewDirective from './search-by-model-data-view.directive';
import { SearchByModelDataComponent } from '../search-by-model-data.component';
import { Table } from 'primeng/table';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FilterService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-search-by-model-data-view',
  templateUrl: './search-by-model-data-view.component.html',
  styleUrls: ['./search-by-model-data-view.component.scss']
})
export class SearchByModelDataViewComponent implements AfterViewInit {

  @ViewChild('profileTabView') profileTabView: MatTabGroup;
  @ViewChildren(SearchByModelDataViewDirective) profileHosts: QueryList<SearchByModelDataViewDirective>;

  items: Item[] = [];
  components: any[] = []
  mindmap: Mindmap;
  formulaData: FormulaData;
  pages: any;
  xml: any;
  user: IUser;
  layoutManager: LayoutManager;
  designer: Designer;
  topics: Topic[] = [];
  refs: any[] = [];
  description: string;
  index = 0;
  init = false;
  visible: Map<string, unknown> = new Map();
  colsMap: Map<number, boolean> = new Map();
  headers: Map<number, string> = new Map();
  cols: any[] = [];

  checkboxes: any = {};
  options: FormlyFormOptions = {};
  path: number[] = [];
  fields: FormlyFieldConfig[] = [];
  cs = 4;
  globalFilterFields: string[] = [];
  formulaDatas: any[] = [];
  loading = true;

  @ViewChildren('matexpansionpanel', {read: ViewContainerRef}) matExpansionPanels: QueryList<MatExpansionPanel>;
  @ViewChild('accordion', {static: true}) accordion: MatAccordion;
  @Input() topic: string;
  @ViewChild('table') table: Table;

  users: IUser[];
  account: Account | null = null;
  modules = {};


  constructor(private accountService: AccountService,
    private maincontrollerService: MaincontrollerService,
    private mindmapService: MindmapService,
    private route: ActivatedRoute,
    private translateService: TranslateService) { }

    ngAfterViewInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.maincontrollerService.findAuthenticatedUserWithDescription().subscribe(u => {
          this.user = u.body;
          this.description = this.user.description;
          this.maincontrollerService.findAllUsersWithFormulaDataAndFriends().subscribe(res => {
            this.users = res.body;
            this.designer = global.designer;
            const root = this.designer.getMindmap().findNodeById(1);
            this.domWalker(root);
            const children = root.getChildren();
            children.forEach(child => {
              this.topics.push(child);
            });
            this.users.forEach(u => {
              this.formulaDatas.push({user: u, data:  u.formulaData});
              if(u.formulaData && u.formulaData.map) {
                const map = new Map(Object.entries(JSON.parse(u.formulaData.map)));
                const grant = new Map(Object.entries(JSON.parse(u.formulaData.grant)));
                map.forEach((value: string, key: string) => {
                  const v =  '__' + key;
                  const gf = grant.get(key);
                  const isFriend = u.friends.find(f => f.friendId === this.account.id);
                  if(!value) {
                    u[v] = this.translateService.instant('search.not-filled');
                  } else if((gf === 'FRIENDS' && !isFriend) || gf === 'NONE') {
                    u[v] = this.translateService.instant('search.not-visible');
                  } else {
                    u[v] = value;
                  }
                });
              }
            });
            this.loading = false;
            this.processData().then(() => {
              this.init = true;
              this.profileHosts.changes.subscribe(() => {
                this.profileHosts.map((vcr: SearchByModelDataViewDirective, i: number) => {
                  const component: typeof SearchByModelDataComponent = SearchByModelDataComponent;
                  this.refs.push(vcr.viewContainerRef.createComponent(component));
                  this.refs[i].instance.topic = this.topics[i];
                  this.refs[i].instance.changeChekbox.subscribe(e => {
                    this.modelChange(e);
                  });
                  this.refs[i].instance.sendModel.subscribe(e => {
                    this.checkboxes = e;
                  });
                 });
                this.route.queryParams.subscribe((queryParams:any) => {
                  const a = queryParams.q;
                  if(a !== undefined) {
                    const c: number[] = [];
                    a.split(',').forEach(el => {
                      c.push(Number(el));
                    });
                  }
                 });
            });
           });
          });
        });
      }
    });
  }

  processData(): Promise<Item[]> {
    return new Promise<Item[]>((resolve) => {
      this.mindmapService.query().subscribe(umm => {
        const mindmaps = umm.body;
        this.mindmap = mindmaps[0];
        this.maincontrollerService.findFormulaDataByUserId(this.user.id).subscribe(res => {
          this.formulaData = res.body;
          const parser = new DOMParser();
          const xml = parser.parseFromString(this.mindmap.text, 'text/xml');
          this.pages = xml.querySelectorAll('[id="form"]');
          let index = 0;
          this.pages.forEach(page => {
            this.items.push({id: `${index}`, header: page.parentElement.getAttribute('text')});
            index++;
          });
          resolve(this.items);
        });
      });
    });
  }

  domWalker(node: Topic) {
    this.headers.set(Number(node.getProperties().id), node.getProperties().text);
      node.getChildren().forEach(childNode => {
          this.domWalker(childNode);
      });
  }

  modelChange(event: any) {
    this.cs = 1;
    if(new Map(Object.entries(this.checkboxes)).get(event.target.id)) {
      this.cs++;
      const n = this.headers.get(Number(event.target.id));
      this.cols.push({field: '__' + event.target.id, header: n});
    } else {
      this.cs--;
      const found = this.cols.findIndex(col => col.field === '__' + event.target.id);
      if(found >= 0) {
        this.cols.splice(found, 1);
      }
    }
  }
}
