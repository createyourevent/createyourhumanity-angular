/**
 * The `MindmapComponent` is a React component that renders a mindmap editor using the `@wisemapping/editor` library.
 * It handles the initialization and configuration of the mindmap editor, including setting up the persistence manager,
 * editor options, and event handlers.
 *
 * The component listens for 'LinkData' events and updates the `MaincontrollerService` with the link data path.
 * It also subscribes to router events to reload the current route when necessary.
 *
 * The `renderComponent` method is responsible for rendering the mindmap editor with the provided `mapId` and other
 * necessary data and options.
 */
// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

import { Component, OnChanges, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Designer, PersistenceManager, CreateYourHumanityPersistenceManager } from '@wisemapping/mindplot';
import { Editor, EditorOptions, EditorProps } from '@wisemapping/editor';
import { SessionStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { UserService } from 'app/user.service';
import { MainComponent } from '../layouts/main/main.component';
import ErrorBoundary from './ErrorBoundary';

interface LinkDataEvent extends Event {
  detail: {
    path: number[];
  };
}

@Component({
  selector: 'jhi-mindmap',
  template: '<div [id]="rootId"></div>',
})
export class MindmapComponent implements OnChanges, AfterViewInit {
  @Input() mapId: any;
  public rootId = 'rootId';
  private hasViewLoaded = false;
  private hasDataLoaded = false;
  private location = 'en';
  private pm: PersistenceManager;
  private account: Account;
  _routerSub = Subscription.EMPTY;

  formula_data: string;
  grants_data: string;
  visibility_data: string;

  constructor(
    private translateService: TranslateService,
    sessionStorageService: SessionStorageService,
    private accountService: AccountService,
    private maincontrollerService: MaincontrollerService,
    private router: Router,
    private userService: UserService
  ) {
    window.addEventListener('LinkData', function (event) {
      const linkDataEvent = event as LinkDataEvent;
      const linkDataPath = linkDataEvent.detail.path;
      this.maincontrollerService.setPath(linkDataPath);
    });
    this.location = sessionStorageService.retrieve('locale') ?? 'en';
    this.formula_data = this.userService.formulaData.map;
    this.grants_data = this.userService.grantsData.map;
    this.visibility_data = this.userService.visibilityData.map;
    /*
    this._routerSub = this.router.events
        .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
        .subscribe(() => {
            this.reloadCurrentRoute();
         });
         */
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['mapId'].currentValue !== undefined) {
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
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
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
    if (this.account) {
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

    if (global.PersistenceManager) {
      this.pm = global.PersistenceManager;
    } else {
      const pm: any = global;
      pm.PersistenceManager = persistence;
      this.pm = persistence;
    }

    const options: EditorOptions = {
      zoom: 0.8,
      locked: false,
      mapTitle: 'Create Your Humanity Mindmap',
      mode: 'edition-owner',
      locale: this.location,
      enableKeyboardEvents: true,
    };

    const props: EditorProps = {
      mapId: this.mapId,
      options: options,
      persistenceManager: this.pm,
      onAction: (action: any) => console.log('action called:', action),
      onLoad: initialization,
    };

    const isFriend = true;

    /**
     * Renders the React application's root element using the provided `mapId` and other options.
     * This is the entry point for the React application and sets up the initial state and event handlers.
     *
     * @param this - The component instance.
     * @returns Void.
     */
    const root = ReactDOM.createRoot(document.getElementById(this.rootId)!);
    root.render(
      <Editor
        mapId={this.mapId}
        options={options}
        values={this.formula_data}
        grants={this.grants_data}
        visible={this.visibility_data}
        isFriend={isFriend}
        persistenceManager={persistence}
        onAction={action => console.log('action called:', action)}
        onLoad={initialization}
      />
    );
  }
}
