import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { UserMindmap } from 'app/entities/user-mindmap/user-mindmap.model';
import { IUser } from 'app/entities/user/user.model';
import dayjs from 'dayjs';
import format from 'xml-formatter';
import LayoutManager from '@wisemapping/mindplot';

@Component({
  selector: 'jhi-mindmap-home-component',
  templateUrl: './mindmap-home.component.html',
  styleUrls: ['./mindmap-home.component.scss']
})
export class MindmapHomeComponent implements OnInit {

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

  constructor(private router:Router,
              private mindmapService: MindmapService,) {
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.mySubscription = this.router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                     this.router.navigated = false;
                  }
                });
              }

  ngOnInit(): void {
        this.mindmapService.query().subscribe(res => {
            this.mindmap = res.body[0];
            if(!this.mindmap) {
              const mm = new Mindmap();
              mm.text = '<map name="625631aa67a303687227eb94" version="tango"><topic central="true" text="Create Your Humanity" id="1" fontStyle="Perpetua;;#ffffff;;;"></topic></map>';
              this.mindmapService.create(mm).subscribe(res => {
                this.formatedXml = format(this.mindmap.text);
                this.xmlId = this.mindmap.id;
              });
            } else {
              const url = document.location.href;
              if(url.includes('localhost:9000')) {
                this.xmlId = '62bb05af4e6db14d6dc56357';
              } else {
                this.xmlId = '62bb05af4e6db14d6dc56357';
              }
              this.formatedXml = format(this.mindmap.text);
            }
        });
  }

}
