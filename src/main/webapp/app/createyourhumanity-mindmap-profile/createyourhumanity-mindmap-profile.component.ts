import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd,  Router } from '@angular/router';
import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import format from 'xml-formatter';
import { Account } from 'app/core/auth/account.model';
import { UserMindmap } from 'app/entities/user-mindmap/user-mindmap.model';
import { IUser } from 'app/entities/user/user.model';
import dayjs from 'dayjs/esm';
import { AccountService } from 'app/core/auth/account.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-createyourhumanity-mindmap-profile',
  templateUrl: './createyourhumanity-mindmap-profile.component.html',
  styleUrls: ['./createyourhumanity-mindmap-profile.component.scss']
})
export class CreateyourhumanityMindmapProfileComponent implements OnInit {

  @ViewChild('mm', {read: ViewContainerRef}) container: ViewContainerRef;

  title = "Create your humanity mindmap"
  mindmap: Mindmap;
  formatedXml: string;
  account: Account | null = null;
  userMindmap: UserMindmap;
  user: IUser;
  profileUser: IUser;
  @Input() xmlId: any;
  @Input() values: Map<string, string>;
  @Input() grants: Map<string, string>;
  @Input() isFriend: string;
  mySubscription;

  constructor(private router:Router,
              private mindmapService: MindmapService,
              private accountService: AccountService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,
              private route: ActivatedRoute,) {
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.mySubscription = this.router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                     this.router.navigated = false;
                  }
                });
              }

  ngOnInit(): void {
    const profileId = this.route.snapshot.queryParamMap.get('userId');
    this.userService.query().subscribe(pu => {
      this.profileUser = pu.body.find(x => x.id === profileId);
    });
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.maincontrollerService.findAuthenticatedUserWithFormulaData().subscribe(u => {
        this.user = u.body;
      });
      this.maincontrollerService.findFormulaDataByUserId(profileId).subscribe(fd => {
        const formulaData = fd.body;
        const map = formulaData.map;
        const grant = formulaData.grant;
        this.values = JSON.parse(map);
        this.grants = JSON.parse(grant);

        this.maincontrollerService.findFriendsFromUser(this.account.id).subscribe(res => {
          const friends = res.body;
          const foundIndex = friends.findIndex(x => x.friendId === profileId);
          if(foundIndex >= 0) {
            this.isFriend= 'true';
          } else {
            this.isFriend = 'false';
          }
        })
      });
          this.mindmapService.query().subscribe(res => {
            this.mindmap = res.body[0];
            if(!this.mindmap) {
              const mm = new Mindmap();
              mm.modified = dayjs();
              mm.text = '<map name="625631aa67a303687227eb94" version="tango"><topic central="true" text="Create Your Humanity" id="1" fontStyle="Perpetua;;#ffffff;;;"></topic></map>';
              this.mindmapService.create(mm).subscribe(res => {
                this.formatedXml = format(this.mindmap.text);
                this.xmlId = this.mindmap.id;
              });
            } else {
              this.formatedXml = format(this.mindmap.text);
              this.xmlId = this.mindmap.id;
            }
        });

      });
  }
}

