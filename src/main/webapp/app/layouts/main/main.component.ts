import { Component, OnInit, RendererFactory2, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import dayjs from 'dayjs/esm';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import { UserMindmap } from 'app/entities/user-mindmap/user-mindmap.model';
import { UserMindmapService } from 'app/entities/user-mindmap/service/user-mindmap.service';
import { UserService } from 'app/entities/user/user.service';
import { IUser, User } from 'app/entities/user/user.model';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  private renderer: Renderer2;
  private account: Account;
  private user: IUser;
  private userMindmap: UserMindmap;

  constructor(
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private translateService: TranslateService,
    rootRenderer: RendererFactory2,
    private maincontrollerService: MaincontrollerService,
    private userMindmapService: UserMindmapService,
    private userService: UserService,
  ) {
    this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(res =>{
      this.account = res;
      if(this.account) {
        this.userService.query().subscribe(res => {
          this.user = res.body.find(x => x.id === this.account.id);
          if(this.account) {
            this.maincontrollerService.findUserMindmapByUserId(this.account.id).subscribe(res => {
              this.userMindmap = res.body;
              if(!this.userMindmap) {
                const mm = new UserMindmap();
                mm.user = this.user;
                mm.modified = dayjs();
                mm.text = '<map name="625631aa67a303687227eb94" version="tango"><topic central="true" text="Create Your Humanity" id="1" fontStyle="Perpetua;;#ffffff;;;"></topic></map>';
                this.userMindmapService.create(mm).subscribe();
              }
            });
          }
        });
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.updateTitle();
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    const title: string = routeSnapshot.data['pageTitle'] ?? '';
    if (routeSnapshot.firstChild) {
      return this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'global.title';
    }
    this.translateService.get(pageTitle).subscribe(title => this.titleService.setTitle(title));
  }
}
