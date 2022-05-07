import {
  Component,
  OnChanges,
  AfterViewInit,
  Input,
  SimpleChanges
} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Designer, PersistenceManager, CreateYourHumanityPersistenceManager } from '@wisemapping/mindplot';
import {Editor, EditorOptions, EditorProps } from '@wisemapping/editor';
import { SessionStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, Subscription } from 'rxjs';


@Component({
  selector: 'jhi-mindmap',
  template: '<div [id]="rootId"></div>'
})
export class MindmapComponent implements OnChanges, AfterViewInit{

  @Input() mapId: any;
  public rootId = 'rootId';
  private hasViewLoaded = false;
  private hasDataLoaded = false;
  private location = 'en';
  private pm: PersistenceManager;
  private account: Account;
  _routerSub = Subscription.EMPTY;

  constructor(private translateService: TranslateService,
                      sessionStorageService: SessionStorageService,
              private accountService: AccountService,
              private maincontrollerService: MaincontrollerService,
              private router: Router) {
    this.location = sessionStorageService.retrieve('locale') ?? 'en';
    this._routerSub = this.router.events
        .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
        .subscribe(() => {
            //this.reloadCurrentRoute();
         });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if(changes['mapId'].currentValue !== undefined) {
      this.hasDataLoaded = true;
      this.mapId = changes['mapId'].currentValue;
      this.renderComponent();
    }
  }

  public ngAfterViewInit() {
    this.hasViewLoaded = true;
    this.renderComponent();
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        console.log(currentUrl);
        this._routerSub.unsubscribe();
    });
  }

  private renderComponent() {
    if (!this.hasViewLoaded || !this.hasDataLoaded) {
      return;
    }

    const initialization = (designer: Designer) => {

      designer.addEvent('loadSuccess', () => {
        const elem = document.getElementById('mindplot');
        if (elem) {
          elem.classList.add('ready');
        }
      });
    };

    let persistence = null;
    if(this.account) {
       persistence = new CreateYourHumanityPersistenceManager({
        documentUrl: 'http://localhost:9000/api/mindmaps/{id}/false',
        revertUrl: '/c/restful/maps/{id}/history/latest',
        lockUrl: '/c/restful/maps/{id}/lock',
      });
    } else {
      persistence = new CreateYourHumanityPersistenceManager({
        documentUrl: 'http://localhost:9000/api/mindmaps/{id}/true',
        revertUrl: '/c/restful/maps/{id}/history/latest',
        lockUrl: '/c/restful/maps/{id}/lock',
      });
    }

  if(global.PersistenceManager) {
    this.pm = global.PersistenceManager;
  } else {
    const pm: any = global;
    pm.PersistenceManager = persistence;
    this.pm = persistence;
  }



    const options: EditorOptions = {
      zoom: 0.8,
      locked: false,
      mapTitle: "Create Your Humanity Mindmap",
      mode: 'edition-owner',
      locale: this.location,
      enableKeyboardEvents: true
    };

    const props: EditorProps = {
      mapId: this.mapId,
      options: options,
      persistenceManager: this.pm,
      onAction: (action: any) => console.log('action called:', action),
      onLoad: initialization
    }


    ReactDOM.render(
      <Editor {...props} />,
      document.getElementById(this.rootId)
    );
  }
}
