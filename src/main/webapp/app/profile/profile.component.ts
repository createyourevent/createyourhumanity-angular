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
import { filter } from 'rxjs';
import { TabPanel, TabView } from 'primeng/tabview';


interface Item {
  id: string,
  header: string
}
@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  items: Item[] = [];
  components: any[] = []
  mindmap: Mindmap;
  formulaData: FormulaData;
  forms: any[] = [];
  pages: any;

  // @ViewChildren(ProfileHostDirective) profileHosts: QueryList<ProfileHostDirective>;
  @ViewChild(TabView) tabView: TabView;
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
              private viewContainerRef: ViewContainerRef ) { }

    ngOnInit(): void {

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

              this.pages.forEach(page => {
                this.forms.push(page.parentElement);
                this.addTab(page.parentElement.getAttribute('text'));
              });
            });
          });
        }
      })
  }

  addTab(title: string) {
    const nTabs = this.tabView.tabs.length;
    const tab: TabPanel = new TabPanel(this.tabView, this.viewContainerRef, this.cd);
    tab.header = title;
    const component: typeof FormComponent = FormComponent;
    const r = tab.viewContainer.createComponent(component);
    r.instance.xml = this.forms[nTabs].outerHTML;
    r.instance.userId = this.userId;
    r.instance.mapId = this.mindmap.id;
    this.tabView.tabs.push(tab);
  }
}

