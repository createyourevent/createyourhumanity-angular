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
import { startWith } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TabPanel, TabView } from 'primeng/tabview';
import { VisibilityStatus } from 'app/entities/visibility-status/visibility-status.model';
import { GrantsLevel } from 'app/entities/grants-level/grants-level.model';
import { IUser } from 'app/entities/user/user.model';
import { ProfileViewHostDirective } from './profile-view-host.directive';
import { IFriends } from '../entities/friends/friends.model';


interface Item {
  id: string,
  header: string
}
@Component({
  selector: 'jhi-profile',
  templateUrl: './profile_view.component.html',
  styleUrls: ['./profile_view.component.scss']
})
export class ProfileViewComponent implements OnInit, AfterViewInit{

  friends: IFriends[];
  items: Item[] = [];
  components: any[] = []
  mindmap: Mindmap;
  formulaData: FormulaData;
  visibilityStatus: VisibilityStatus;
  grantsLevel: GrantsLevel;
  forms: any[] = [];
  pages: any;
  xml: any;
  @Input() allLoaded: boolean = false;
  user: IUser;

  @ViewChildren(ProfileViewHostDirective) profileHosts: QueryList<ProfileViewHostDirective>;
  @Input() userId: string;
  @Input() mapId: string;

  account: Account | null = null;
  ngAfterViewInit(): void {
    this.profileHosts.changes.pipe(
      startWith(null),
      filter(Boolean)
    ).subscribe(() => {
      this.cd.detectChanges();
    });
  }
  constructor(private formService: FormService,
              private accountService: AccountService,
              private formulaDataService: FormulaDataService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,
              private mindmapService: MindmapService,
              private cd: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,
              private viewContainerRef: ViewContainerRef) {
                console.log("profile view component constructor");
               }

  ngOnInit(): void {
    console.log("userid: "  + this.userId);

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
  }


