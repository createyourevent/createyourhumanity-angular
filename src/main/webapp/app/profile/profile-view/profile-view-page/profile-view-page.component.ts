import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { Component, Input, AfterViewInit, ViewChildren, QueryList, OnInit, ChangeDetectorRef, ViewContainerRef, ViewChild } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { UserService } from 'app/entities/user/user.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { Account } from 'app/core/auth/account.model';
import { startWith } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TabPanel, TabView } from 'primeng/tabview';
import ProfileViewHostDirective from './profile-view-host.directive';
import { ProfileViewPageService } from '../profile-view.service';
import { ProfileViewComponent } from '../profile-view.component';
import { FormulaData } from 'app/entities/formula-data/formula-data.model';


interface Item {
  id: string,
  header: string
}
@Component({
  selector: 'jhi-profile-view-page',
  templateUrl: './profile-view-page.component.html',
  styleUrls: ['./profile-view-page.component.scss']
})
export class ProfileViewPageComponent implements OnInit, AfterViewInit{

  items: Item[] = [];
  components: any[] = []
  mindmap: Mindmap;
  formulaData: FormulaData;
  forms: any[] = [];
  pages: any;
  xml: any;

  @ViewChildren(ProfileViewHostDirective) profileHosts: QueryList<ProfileViewHostDirective>;
  @Input() userId: string;
  @Input() mapId: string;

  account: Account | null = null;

  constructor(private formService: ProfileViewPageService,
              private accountService: AccountService,
              private formulaDataService: FormulaDataService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,
              private mindmapService: MindmapService,
              private cd: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,
              private viewContainerRef: ViewContainerRef ) { }

  ngOnInit() {
    const profileId = this.route.snapshot.queryParamMap.get('userId');
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
          this.mindmapService.query().subscribe(umm => {
            const mindmaps = umm.body;
            this.mindmap = mindmaps[0];
            this.maincontrollerService.findFormulaDataByUserId(profileId).subscribe(res => {
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
            });
          });
        }
      })
  }

  ngAfterViewInit(): any {
    this.profileHosts.changes.subscribe(ph => {
      let index = 0;
      ph.forEach(p => {
        const component: typeof ProfileViewComponent = ProfileViewComponent;
        const r = p.viewContainerRef.createComponent(component);
        r.instance.xml = this.forms[index].outerHTML;
        r.instance.userId = this.userId;
        r.instance.mapId = this.mindmap.id;
        index++;
      });
    });
  }
}

