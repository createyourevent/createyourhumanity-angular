import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Designer, Topic} from '@wisemapping/mindplot';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { DesignerGlobalService } from 'app/designer-global.service';
import { IUser } from 'app/entities/user/user.model';
import { LoginService } from 'app/login/login.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { FilterMetadata, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'jhi-search-by-model-data',
  templateUrl: './search-by-model-data.component.html',
  styleUrls: ['./search-by-model-data.component.scss']
})


export class SearchByModelDataComponent implements OnInit {


  designer: Designer
  topics: Topic[] = [];
  loading = true;
  users: IUser[];
  colsMap: Map<number, boolean> = new Map();
  headers: Map<number, string> = new Map();
  cols: any[] = [];
  form = new FormGroup({});
  checkboxes: any = {};
  options: FormlyFormOptions = {};
  path: number[] = [];
  fields: FormlyFieldConfig[] = [];
  cs = 4;
  globalFilterFields: string[] = [];
  filters: FilterMetadata[] = [];
  formulaDatas: any[] = [];
  topic: any;

  @ViewChild('dt') table: Table;
  @ViewChild('profileTabView') profileTabView: MatTabGroup;

  account: Account | null = null;

  @Output() changeChekbox = new EventEmitter();
  @Output() sendModel = new EventEmitter();

  constructor(private designerGlobalService: DesignerGlobalService,
              private primengConfig: PrimeNGConfig,
              private maincontrollerService: MaincontrollerService,
              private accountService: AccountService,
              private loginService: LoginService,) { }

  initGlobal(): void {
    this.globalFilterFields = [];
  }

  ngOnInit() {
    this.initGlobal();
    this.accountService.identity().subscribe(account => {
      this.account = account;
      if(this.account) {

        this.primengConfig.ripple = true;
        this.domWalker(this.topic);
        this.maincontrollerService.findAllUsersWithFormulaDataAndFriends().subscribe(res => {
          this.users = res.body;
          this.users.forEach(u => {
            this.formulaDatas.push({user: u, data:  u.formulaData});
          });
          this.loading = false;
        });
      } else {
        this.loginService.login();
      }
    });
  }

  domWalker(node) {
    this.topics.push(node);
    this.parseJSON(node);
    this.headers.set(Number(node.getProperty('id')), node.getProperty('text'));
    if (node.getChildren().length > 0) {
      node.getChildren().forEach(childNode => {
        this.domWalker(childNode);
      });
    }
  }

  parseJSON(node) {
    const n = node;
    const f = node.getFeatures()[0];
    const c = node.getControls()[0];

    if(f) {
      if (f.getType() === 'htmlForm' && f.getAttribute('id') === 'form') {
        this.addDynamicFormlyPage(n);
      } else if (f.getType() === 'htmlForm' && f.getAttribute('id') === 'multi_step_form') {
        this.convertMultistepForm(n);
      } else if (f.getType() === 'htmlForm' && f.getAttribute('id') === 'tabs_form') {
        this.convertTabsForm(n);
      } else if (f.getType() === 'htmlFormStep') {
        this.convertStep(n);
      } else if (f.getType() === 'htmlFormTab') {
        this.convertTab(n);
      }
    }
    else if(c) {
      const fg = this.getFieldGroup(node);
      if(c.getType() !== 'radio' && c.getType() !== 'option') {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'checkbox',
          wrappers: ['form-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
          },
        }
      );
    }
   }
  }

  changeEvent(event) {
    this.changeChekbox.emit(event);
  }

  modelChange(event) {
    this.sendModel.emit(event);
  }

  getFieldGroup(node): string {
    const arr: string[] = [];
    const group = 'this.fields';
    arr[0] = group;

    let level = -1;
    do {
      node = node.getParent();
      if(node) {
        level++;
      }
    }while(node);

    for(let i = 0; i < level; i++) {
      arr[i + 1] = arr[i] + '[' + arr[i] + '.length - 1].fieldGroup'
    }
    return arr[arr.length - 1];
  }


  addDynamicFormlyPage(node: any): void {

    const n = node.getParent().getProperty('id');
    if(n !== 1) {
      eval(this.getFieldGroup(node)).push(
        {
          id: node.getProperty('id'),
          type: ['container'],
          wrappers: ['expansion'],
          fieldGroup: []
        }
      );
    } else {
      eval(this.getFieldGroup(node)).push(
        {
          id: node.getProperty('id'),
          fieldGroup: []
        }
      );
    }
  }

  convertMultistepForm(node: any) {
    let selectedIndex: number;
    let expanded = 'false';
    if(this.path.length > 1) {
      if(this.path[0] === node.getId()) {
        expanded = 'true';
      }
      const found = this.path.findIndex(x => x === Number(node.getProperty('id')));
      const designer = global.designer;
      const child: Topic = designer.getMindmap().findNodeById(this.path[1]);
      if(found >= 0) {
        const children = node.getChildren();
        for(let j = 0; j < children.length; j++) {
          if(children[j].getProperty('text') === child.getProperty('text')) {
            selectedIndex = j;
            break;
          }
        }
      }
    }
    eval(this.getFieldGroup(node)).push(
          {
            type: 'stepper',
            id: node.getProperty('id'),
            wrappers: ['expansion'],
            selectedIndex: selectedIndex,
            templateOptions: {
              label: node.getProperty('text'),
              bgColor: node.getProperty('backgroundColor'),
              color: node.getProperty('fontColor'),
              expanded: expanded,
            },
            fieldGroup: []
         }
    );
  }

  convertStep(node: any) {
    if(this.path[0] === node.getParent().getId()) {
      this.path.splice(0, 2);
    }
    const fg = this.getFieldGroup(node);
    eval(fg).push(
      {
        id: node.getProperty('id'),
        templateOptions: { label: node.getProperty('text') },
        fieldGroup: []
      }
    );
  }

  convertTabsForm(node: any) {
    let selectedIndex: number;
    let expanded = 'false';
    if(this.path.length > 1) {
      if(this.path[0] === node.getId()) {
        expanded = 'true';
      }
      const found = this.path.findIndex(x => x === Number(node.getProperty('id')));
      const designer = global.designer;
      const child: Topic = designer.getMindmap().findNodeById(this.path[1]);
      if(found >= 0) {
        const children = node.getChildren();
        for(let j = 0; j < children.length; j++) {
          if(children[j].getProperty('text') === child.getProperty('text')) {
            selectedIndex = j;
            break;
          }
        }
      }
    }
    const fg = this.getFieldGroup(node);
    eval(fg).push(
      {
        type: 'tabs',
        selectedIndex: selectedIndex,
        wrappers: ['expansion'],
        templateOptions: {
          label: node.getProperty('text'),
          bgColor: node.getProperty('backgroundColor'),
          color: node.getProperty('fontColor'),
          expanded: expanded
        },
        fieldGroup: []
      }
    );
  }

  convertTab(node: any) {
    if(this.path[0] === node.getParent().getId()) {
      this.path.splice(0, 2);
    }
    const fg = this.getFieldGroup(node);
    eval(fg).push(
      {
        templateOptions: { label: node.getProperty('text') },
        fieldGroup: []
      }
    );
  }

}
