import { FormComponent } from './../form/form.component';
import { FormulaData, IFormulaData } from './../entities/formula-data/formula-data.model';
import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { Component, Input, AfterViewInit, ViewChildren, QueryList, OnInit, ViewChild, ElementRef, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { Account } from 'app/core/auth/account.model';
import { ProfileHostDirective } from './profile-host.directive';
import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { LayoutManager } from '@wisemapping/mindplot';
import { Designer, Topic } from '@wisemapping/mindplot';
import { LoginService } from 'app/login/login.service';
import { UserService } from 'app/entities/user/user.service';
import { MatTabGroup } from '@angular/material/tabs';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';

interface Item {
  id: string,
  header: string
}
@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, AfterViewInit {

  items: Item[] = [];
  components: any[] = []
  mindmap: Mindmap;
  formulaData: FormulaData;
  forms: any[] = [];
  pages: any;
  xml: any;
  user: IUser;
  layoutManager: LayoutManager;
  designer: Designer;
  topic: Topic;
  topics: Topic[] = [];
  refs: any[] = [];
  description: string;
  path: number[];
  index = 0;


  @ViewChildren(ProfileHostDirective) profileHosts: QueryList<ProfileHostDirective>;
  @ViewChild('mainTabView') mainTabView: MatTabGroup;
  @ViewChild('profileTabView') profileTabView: MatTabGroup;
  @ViewChildren('matexpansionpanel', {read: ViewContainerRef}) matExpansionPanels: QueryList<MatExpansionPanel>;
  @ViewChild('accordion', {static: true}) accordion: MatAccordion;


  @Input() userId: string;
  @Input() mapId: string;

  account: Account | null = null;

  constructor(private accountService: AccountService,
              private maincontrollerService: MaincontrollerService,
              private mindmapService: MindmapService,
              private formulaDataService: FormulaDataService,
              private loginService: LoginService,
              private userService: UserService,
              ) {
                window.addEventListener('LinkData', (e: CustomEvent) => {
                  if (e.detail.path.length > 0 && this.mainTabView.selectedIndex === 0) {
                    this.path = e.detail.path;

                    this.openPath(this.path);
                    e.stopPropagation();
                  } else {
                    this.path = [];
                  }
                });
               }



  ngAfterViewInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.maincontrollerService.findAuthenticatedUserWithDescription().subscribe(u => {
          this.user = u.body;
          this.description = this.user.description;
        });
        this.processData().then(() => {
          this.profileHosts.changes.subscribe(() => {
            this.profileHosts.map((vcr: ProfileHostDirective, i: number) => {
              const component: typeof FormComponent = FormComponent;
              this.refs.push(vcr.viewContainerRef.createComponent(component));
              this.refs[i].instance.userId = this.userId;
              this.refs[i].instance.mapId = this.mindmap.id;
              this.refs[i].instance.topic = this.topics[i];
              this.refs[i].instance.initComponent().then(() => {
                for(let y = this.refs.length - 1; y--; y >= 0) {
                  this.refs[y].instance.cloneFields();
                }
              });
            });
        });
      });
      }
    });
  }

  openPath(arr_path: number[]): void {
    arr_path.reverse();
    this.mainTabView.selectedIndex = arr_path[0];
    this.mainTabView.focusTab(arr_path[0]);
    this.mainTabView.realignInkBar();
    arr_path.splice(0,1);
    this.mainTabView.animationDone.subscribe(() => {
      const designer = global.designer;
      if(arr_path && arr_path.length > 0) {
        const fieldSearched: Topic = designer.getMindmap().findNodeById(arr_path[0]);
        let index = 0;
        const arr = this.profileTabView._allTabs.toArray();
        const t = fieldSearched.getText();
        for(let i = 0; i < this.profileTabView._allTabs.length; i++) {
          if(arr[i].textLabel === t) {
            index = i;
            break;
          }
        }
        this.profileTabView.selectedIndex = index;
        this.profileTabView.focusTab(index);
        this.profileTabView.realignInkBar();
        arr_path.splice(0,1);
        if(index === 0) {
          this.refs[index].instance.setPath(arr_path);
        } else {
          this.profileTabView.animationDone.subscribe(() => {
            this.refs[index].instance.setPath(arr_path);
          });
        }
      }
    });
  }

  handleChange(event): void {
    if(event.index === 1) {
      this.refs.forEach(r => {
        r.instance.cloneFields();
        r.instance.reloadData();
      });
    }
  }

  processData(): Promise<Item[]> {
    return new Promise<Item[]>((resolve) => {
      this.mindmapService.query().subscribe(umm => {
        const mindmaps = umm.body;
        this.mindmap = mindmaps[0];
        this.maincontrollerService.findFormulaDataByUserId(this.userId).subscribe(res => {
          this.formulaData = res.body;
          const parser = new DOMParser();
          const xml = parser.parseFromString(this.mindmap.text, 'text/xml');
          this.pages = xml.querySelectorAll('[id="form"]');
          let index = 0;
          this.pages.forEach(page => {
            this.forms.push(page.parentElement);
            this.items.push({id: `${index}`, header: page.parentElement.getAttribute('text')});
            index++;
          });
          this.designer = global.designer;
          const root = this.designer.getMindmap().findNodeById(1);
          const children = root.getChildren();
          children.forEach(child => {
            this.topics.push(child);
          });
          resolve(this.items);
        });
      });
    });
  }

  ngOnInit() {
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
          this.maincontrollerService.findAuthenticatedUserWithFormulaData().subscribe(u => {
            this.user = u.body;
            this.checkFormulaDataFromUser(this.account);
          });
        } else {
          this.loginService.login()
        }
      },
      error => {
        if(error.status === 401) {
          this.loginService.login()
        }
      });
  }

  private checkFormulaDataFromUser(account: Account): void {
    this.maincontrollerService.findFormulaDataByUserId(account.id).subscribe(fd => {
      if(!fd.body) {
        this.maincontrollerService.findAuthenticatedUser().subscribe(u => {
          const user = u.body;
          const formulaData: IFormulaData = new FormulaData();
          formulaData.map = '{}';
          formulaData.grant = '{}';
          formulaData.created = dayjs();
          formulaData.modified = dayjs();
          formulaData.user = user;
          this.formulaDataService.create(formulaData).subscribe();
        });
      }
    });
  }

  saveUserDescription() {
    this.user.description = this.description;
    this.userService.update(this.user).subscribe();
  }
}

