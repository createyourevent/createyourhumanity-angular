import { FormComponent } from './../form/form.component';
import { FormulaData } from './../entities/formula-data/formula-data.model';
import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { FormService } from './../form/form.service';
import { Component, Input, AfterViewInit, ViewChildren, QueryList, OnInit, ChangeDetectorRef, ViewContainerRef, ViewChild } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { UserService } from 'app/entities/user/user.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { Account } from 'app/core/auth/account.model';
import { ProfileHostDirective } from './profile-host.directive';
import { startWith } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { TabPanel, TabView } from 'primeng/tabview';
import { VisibilityStatus } from 'app/entities/visibility-status/visibility-status.model';
import { GrantsLevel } from 'app/entities/grants-level/grants-level.model';
import { IUser } from 'app/entities/user/user.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

interface Item {
  id: string,
  header: string
}
@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit{

  items: Item[] = [];
  components: any[] = []
  mindmap: Mindmap;
  formulaData: FormulaData;
  visibilities: VisibilityStatus;
  grants: GrantsLevel;
  forms: any[] = [];
  pages: any;
  xml: any;
  @Input() allLoaded: boolean = false;
  user: IUser;

  private eventSubscriber?: Subscription;

  @ViewChildren(ProfileHostDirective) profileHosts: QueryList<ProfileHostDirective>;
  @Input() userId: string;
  @Input() mapId: string;

  account: Account | null = null;

  constructor(private formService: FormService,
              private accountService: AccountService,
              private formulaDataService: FormulaDataService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,
              private mindmapService: MindmapService,
              private cd: ChangeDetectorRef,
              private router: Router,
              private viewContainerRef: ViewContainerRef,
              private eventManager: EventManager ) {
                this.eventSubscriber = this.eventManager.subscribe('LinkData', (event: EventWithContent<unknown> | string) => {
                  if (typeof event !== 'string' && event.name === 'LinkData') {
                    const linkDataEvent = event as EventWithContent<{ path: number[] }>;
                    const linkDataPath = linkDataEvent.content.path;
                    this.maincontrollerService.setPath(linkDataPath);
                  }
                });
              }


  ngOnInit() {
    this.maincontrollerService.findAuthenticatedUser().subscribe(res => {
      this.user = res.body;
      this.userId = this.user.id;
    });
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
          this.mindmapService.query().subscribe(umm => {
            const mindmaps = umm.body;
            this.mindmap = mindmaps[0];
            this.maincontrollerService.findFormulaDataByUserId(this.userId).subscribe(res => {
              this.formulaData = res.body;
              const parser = new DOMParser();
              const xml = parser.parseFromString(this.mindmap.text, 'text/xml');
              this.pages = xml.querySelectorAll('[id="form"]');

              this.pages.forEach((page: any, index: number) => {
                this.forms.push(page.parentElement);
                this.items.push({id: `${index}`, header: page.parentElement.getAttribute('text')});
                if(index === this.pages.length - 1){
                  this.allLoaded = true;
                }
              });
            });
          });
        }
      })
  }

  ngAfterViewInit(): any {
      this.profileHosts.changes.subscribe((ph: QueryList<ProfileHostDirective>)  => {
        ph.forEach((p: any, index: number)=> {
          ph.first;
          const component: typeof FormComponent = FormComponent;
          const r = p.viewContainerRef.createComponent(component);
          r.instance.xml = this.forms[index].outerHTML;
          r.instance.userId = this.userId;
          r.instance.mapId = this.mindmap.id;
          this.maincontrollerService.findGrantsLevelByUserId(this.userId).subscribe(res => {
            this.grants = res.body;
            r.instance.grants = this.grants;
        });

        });
      });
    }
  }


