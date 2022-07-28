import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { Component, Input, AfterViewInit, ViewChildren, QueryList, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { Account } from 'app/core/auth/account.model';
import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { LayoutManager } from '@wisemapping/mindplot';
import { Designer, Topic } from '@wisemapping/mindplot';
import { LoginService } from 'app/login/login.service';
import { FormulaData, IFormulaData } from 'app/entities/formula-data/formula-data.model';
import ProfileViewPageHostDirective from './profile-view-page-host.directive';
import { ProfileViewComponent } from '../profile-view.component';
import { ActivatedRoute } from '@angular/router';
import { MatExpansionPanel, MatAccordion } from '@angular/material/expansion';
import { MatTabGroup } from '@angular/material/tabs';
import { DesignerGlobalService } from 'app/designer-global.service';

interface Item {
  id: string,
  header: string
}
@Component({
  selector: 'jhi-profile-view-page',
  templateUrl: './profile-view-page.component.html',
  styleUrls: ['./profile-view-page.component.scss'],
})
export class ProfileViewPageComponent implements OnInit, AfterViewInit {

  items: Item[] = [];
  components: any[] = []
  mindmap: Mindmap;
  formulaData: FormulaData;
  forms: any[] = [];
  pages: any;
  xml: any;
  user: IUser;

  profileUser: IUser;
  layoutManager: LayoutManager;
  designer: Designer;
  topic: Topic;
  topics: Topic[] = [];
  refs: any[] = [];
  path: number[];
  index = 0;


  @ViewChildren(ProfileViewPageHostDirective) profileHosts: QueryList<ProfileViewPageHostDirective>;
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
              private route: ActivatedRoute,
              private designerGlobalService: DesignerGlobalService) {
                window.addEventListener('LinkData', (e: CustomEvent) => {
                  if (e.detail.path.length > 0 && this.mainTabView.selectedIndex === 0) {
                    this.path = e.detail.path;

                    this.openPath(this.path);
                    e.stopPropagation();
                  } else {
                    this.path = [];
                  }
                });
                window.addEventListener('VisibleRepaint', (e: CustomEvent) => {
                  if (e.detail.topic && e.detail.iconType && e.detail.formulaData) {
                    const n = this.designer.getMindmap().findNodeById(e.detail.topic);
                    this.domWalker(n);
                    this.domParentWalker(n);
                    e.stopPropagation();
                  }
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

  ngAfterViewInit(): void {
    const profileId = this.route.snapshot.queryParamMap.get('userId');
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.maincontrollerService.findAllUsersWithFormulaDataAndFriends().subscribe(users => {
          this.profileUser = users.body.find(x => x.id === profileId);
          this.user = users.body.find(x => x.id === this.account.id);
          this.maincontrollerService.findFormulaDataByUserId(this.profileUser.id).subscribe(pu => {
          this.processData().then(i => {
            this.items = i;
            this.profileHosts.changes.subscribe(() => {
              //this.profileHosts.map((vcr: ProfileViewPageHostDirective, i: number, arr: []) => {
              let index = 0;
              for(let i = 0; i < this.pages.length; i++) {
                const a = JSON.parse(pu.body.visible);
                const b = a[Number(this.pages[i].parentElement.id)];
                const c = this.pages[i].parentElement.getAttribute('text');
                const d = this.items.findIndex(x => x.header === c);
                if(b === 'visible_visible' &&  d >= 0) {
                  const component: typeof ProfileViewComponent = ProfileViewComponent;
                  this.refs.push(this.profileHosts.toArray()[index].viewContainerRef.createComponent(component));
                  this.refs[index].instance.userId = this.userId;
                  this.refs[index].instance.mapId = this.mindmap.id;
                  this.refs[index].instance.topic = this.topics[i];
                  this.refs[index].instance.visible = this.profileUser.formulaData.visible;
                  this.refs[index].instance.initComponent().then(() => {
                  for(let y = 0; y++; y <= this.refs.length - 1) {
                      this.refs[y].instance.cloneFields();
                    }
                  });
                  index++;
                }
               };
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
        this.maincontrollerService.findFormulaDataByUserId(this.userId).subscribe(res => {
          this.maincontrollerService.findFormulaDataByUserId(this.profileUser.id).subscribe(pu => {
            const fdpu = pu.body;
          const parser = new DOMParser();
          const xml = parser.parseFromString(this.mindmap.text, 'text/xml');
          this.pages = xml.querySelectorAll('[id="form"]');
          let index = 0;
          const i = [];
          this.pages.forEach(page => {
            const a = JSON.parse(fdpu.visible);
            const b = a[Number(page.parentElement.id)];
            if(b === 'visible_visible') {
              this.forms.push(page.parentElement);
              i.push({id: page.parentElement.getAttribute('id'), header: page.parentElement.getAttribute('text')});
              index++;
            }


          });
          this.designerGlobalService.getDesigner().subscribe(designer => {
            this.designer = designer;
            if(this.designer) {
              const root = this.designer.getMindmap().findNodeById(1);
              const children = root.getChildren();
              children.forEach(child => {
                this.topics.push(child);
              });
              resolve(i);
            }
          });
         });
        });
      });
    });
  }

  domWalker(node) {
    this.repaintTopic(node);
    if (node.getChildren().length > 0) {
      node.getChildren().forEach(childNode => {
        this.domWalker(childNode);
      });
    }
}

domParentWalker(node) {
  this.repaintTopic(node);
  if (node.getParent() != null) {
      this.domParentWalker(node.getParent());
  }
}

repaintTopic(node) {
  node.adjustShapes();
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

  private checkFormulaDataFromUser(account: Account): void {
    this.maincontrollerService.findFormulaDataByUserId(account.id).subscribe(fd => {
      if(!fd.body) {
        this.maincontrollerService.findAuthenticatedUser().subscribe(u => {
          const user = u.body;
          const formulaData: IFormulaData = new FormulaData();
          formulaData.map = '{}';
          formulaData.grant = '{}';
          formulaData.group = '{}';
          formulaData.created = dayjs();
          formulaData.modified = dayjs();
          formulaData.user = user;
          this.formulaDataService.create(formulaData).subscribe();
        });
      }
    });
  }
}
