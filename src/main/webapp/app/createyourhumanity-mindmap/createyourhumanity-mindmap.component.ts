import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { filter } from 'rxjs';
import format from 'xml-formatter';
import { Account } from 'app/core/auth/account.model';
import { UserMindmap } from 'app/entities/user-mindmap/user-mindmap.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import { UserService } from 'app/entities/user/user.service';
import { IUser } from 'app/entities/user/user.model';
import dayjs from 'dayjs/esm';
import { MindmapComponent } from 'app/mindmap/mindmap.component';
import LayoutManager, { LayoutManager_getInstance } from '@wisemapping/mindplot';
import { DesignerGlobalService } from 'app/designer-global.service';

@Component({
  selector: 'jhi-createyourhumanity-mindmap',
  templateUrl: './createyourhumanity-mindmap.component.html',
  styleUrls: ['./createyourhumanity-mindmap.component.scss']
})
export class CreateyourhumanityMindmapComponent implements OnInit {

  @ViewChild('mm', {read: ViewContainerRef}) container: ViewContainerRef;

  title = "Create your humanity mindmap"
  mindmap: Mindmap;
  formatedXml: string;
  account: Account | null = null;
  userMindmap: UserMindmap;
  user: IUser;
  xmlId: any;
  mySubscription;
  layoutManager: LayoutManager;
  isAdmin: boolean;
  values: any;
  grants: any;
  isFriend: any;

  constructor(private router:Router,
              private mindmapService: MindmapService,
              private accountService: AccountService,
              private maincontrollerService: MaincontrollerService,
              private designerGlobalService: DesignerGlobalService) {
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.mySubscription = this.router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                     this.router.navigated = false;
                  }
                });
              }

  setDesigner(e: any) {
    this.designerGlobalService.setDesigner(e);
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;

      this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(r => {
        const fd = r.body;
        this.values = JSON.parse(fd.map);
        this.grants = JSON.parse(fd.grant);
        this.isFriend = true;
      });

      this.account.authorities.forEach(el => {
        if(el === "ROLE_ADMIN") {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      });
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
              const url = document.location.href;
              if(url.includes('localhost:9000')) {
                this.xmlId = '6281b488c02b8d7b528278f3';
              } else {
                this.xmlId = '62bb05af4e6db14d6dc56357';
              }
              this.formatedXml = format(this.mindmap.text);
            }
        });
  }
}

