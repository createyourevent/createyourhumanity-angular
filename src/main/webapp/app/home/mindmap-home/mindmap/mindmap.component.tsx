import {
  Component,
  OnChanges,
  AfterViewInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Designer, PersistenceManager } from '@wisemapping/mindplot';
import {Editor, EditorOptions, EditorProps } from '@wisemapping/editor';
import { SessionStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import MongoStorageManager from './MongoStorageManager.component';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import { DesignerGlobalService } from 'app/designer-global.service';


@Component({
  selector: 'jhi-mindmap-start',
  template: '<div [id]="rootId"></div>',
})
export class MindmapStartComponent implements OnChanges, AfterViewInit{

  @Input() mapId: any;
  @Input() map: any;
  @Input() isProfile: any;
  @Input() readOnly: any;
  @Input() admin: any;
  @Input() values: any;
  @Input() grants: any;
  @Input() visible: any;
  @Input() isFriend: any;
  public rootId = 'rootId';
  private hasViewLoaded = false;
  private hasDataLoaded = false;
  private hasXMLLoaded = false;
  private location = 'de';
  private pm: PersistenceManager;
  private account: Account;
  private isAdmin = false;
  _routerSub = Subscription.EMPTY;

  constructor(private translateService: TranslateService,
                      sessionStorageService: SessionStorageService,
              private accountService: AccountService,
              private formulaDataService: FormulaDataService,
              private maincontrollerService: MaincontrollerService,
              private router: Router,
              private mindmapService: MindmapService,
              private designerGlobalService: DesignerGlobalService) {
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

    if(changes['map'].currentValue !== undefined) {
      this.hasXMLLoaded = true;
      this.map = changes['map'].currentValue;
      this.pm = new MongoStorageManager(this.map, false, this.readOnly ,this.mindmapService, this.maincontrollerService);
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
        this._routerSub.unsubscribe();
    });
  }

  private renderComponent() {
    if (!this.hasViewLoaded || !this.hasDataLoaded || !this.hasXMLLoaded) {
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



        if(global.PersistenceManager) {
          this.pm = global.PersistenceManager;
        } else {
          const pm: any = global;
          pm.PersistenceManager = this.pm;
        }
          if(this.admin) {
            this.isAdmin = this.admin;
          }
          let m = '';
          if(this.isAdmin) {
            m = 'edition-owner';
          } else {
            m = 'viewonly';
          }

          const options: EditorOptions = {
            zoom: 0.8,
            locked: false,
            mapTitle: "Create Your Humanity Mindmap",
            mode: m,
            locale: this.location,
            enableKeyboardEvents: true,
            isProfile: this.isProfile,
          };

          const v = this.values;
          const n = this.grants;
          const vi = this.visible;
          const iff = this.isFriend;

          const props: EditorProps = {
            mapId: this.mapId,
            options: options,
            values: {v},
            grants: {n},
            visible: {vi},
            isFriend: {iff},
            persistenceManager: this.pm,
            onAction: (action: any) => console.log('action called:', action),
            onLoad: initialization
          }


          ReactDOM.render(
            <Editor {...props} />,
            document.getElementById(this.rootId)
          );
    };
 }

