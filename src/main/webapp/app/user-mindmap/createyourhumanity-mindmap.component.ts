import { Component, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
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

@Component({
  templateUrl: './createyourhumanity-mindmap.component.html',
  styleUrls: ['./createyourhumanity-mindmap.component.scss']
})
export class CreateyourhumanityMindmapComponent implements OnInit {

  title = "Create your humanity mindmap"
  mindmap: Mindmap;
  formatedXml: string;
  account: Account | null = null;
  userMindmap: UserMindmap;
  user: IUser;
  xmlId: any;

  constructor(private router:Router,
              private mindmapService: MindmapService,
              private accountService: AccountService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      window.location.reload();
    });

    this.accountService.identity().subscribe(res =>{
      this.account = res;
      if(this.account) {
        this.userService.query().subscribe(res => {
          this.user = res.body.find(x => x.id === this.account.id);
          if(this.account) {
            this.maincontrollerService.findUserMindmapByUserId(this.account.id).subscribe(res => {
              this.userMindmap = res.body;
              this.formatedXml = format(this.userMindmap.text);
              this.xmlId = this.userMindmap.id;
            });
          }
        });
      } else {
        this.mindmapService.query().subscribe(res => {
          if(res.body.length === 1) {
            this.mindmap = res.body[0];
            this.formatedXml = format(this.mindmap.text);
            this.xmlId = this.mindmap.id;
          }
        });
      }
    });
  }

}
