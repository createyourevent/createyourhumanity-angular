import { ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
/* eslint-disable no-eval */
import { IUser } from 'app/entities/user/user.model'
import { FormulaDataService } from './../entities/formula-data/service/formula-data.service'
import dayjs from 'dayjs/esm'
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core'
import { Account } from 'app/core/auth/account.model'
import { AccountService } from 'app/core/auth/account.service'
import { MaincontrollerService } from 'app/maincontroller.service'
import { Designer, Topic} from '@wisemapping/mindplot';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'jhi-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {

  form = new FormGroup({})
  model: any = {}
  grant: any = {}
  group: any = {}
  options: FormlyFormOptions = {}
  json: {};
  account: Account | null = null;
  user: IUser;
  formId: string;
  designer: Designer;
  fields: FormlyFieldConfig[] = [];
  path: number[] = [];

  @Input() userId: string;
  @Input() mapId: string;
  @Input() topic: string;
  @Input() relations: Map <string, string>;

  constructor(private accountService: AccountService,
              private formulaDataService: FormulaDataService,
              private maincontrollerService: MaincontrollerService,
              ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.maincontrollerService.findAuthenticatedUser().subscribe(u => {
        this.user = u.body;
      });
    });
  }

  initComponent(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.fields = [];
      this.accountService.identity().subscribe(account => {
        this.account = account
        if(this.account) {
            this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
              const fd = res.body;
              this.model = JSON.parse(fd.map);
              this.grant = JSON.parse(fd.grant);
              this.group = JSON.parse(fd.group);
              this.domWalker(this.topic);
              this.path = [];
              resolve();
            });
        }
      });
    });
  }

  setPath(path: number[]) {
    this.path = path;
    this.reloadData();
  }

  cloneFields(): void {
    this.fields = this.fields.splice(0);
  }

  reloadData(): void {
    this.fields = [];
    this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
      const fd = res.body;
      this.model = JSON.parse(fd.map);
      this.grant = JSON.parse(fd.grant);
      this.group = JSON.parse(fd.group);
      this.domWalker(this.topic);
      this.path = [];
    });
  }


  domWalker(node) {
      this.parseJSON(node);
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
      const l = node.getLayout()[0];

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
        let req = false;
        const x = c.getAttribute('required');
        if(x === 'false') {
          req = false;
        } else {
          req = true;
        }

        let f = false;
        if(this.path[this.path.length - 1] === node.getId()) {
          f = true;
        }

        if (c.getType() === 'textfield') {
          this.convertTextfield(n, req, f);
        } else if (c.getType() === 'textarea') {
          this.convertTextarea(n, req, f);
        } else if (c.getType() === 'select') {
          this.convertSelect(n, req, f);
        } else if (c.getType() === 'radiogroup') {
          this.convertRadiogroup(n, req, f);
        } else if (c.getType() === 'checkbox') {
          this.convertCheckbox(n, req, f);
        } else if (c.getType() === 'calendar') {
          this.convertCalendar(n, req, f);
        } else if (c.getType() === 'editor') {
          this.convertEditor(n, req, f);
        } else if (c.getType() === 'time') {
          this.convertTime(n, req, f);
        } else if (c.getType() === 'address') {
          this.convertAddress(n, req, f);
        } else if (c.getType() === 'keywords') {
          this.convertKeywords(n, req, f);
        } else if (c.getType() === 'ratings') {
          this.convertRating(n, req, f);
        } else if (c.getType() === 'multicheckbox') {
          this.convertMulticheckbox(n, req, f);
        } else if (c.getType() === 'multiselectbox') {
          this.convertMultiselect(n, req, f);
        }
      }
      else if(l) {
        if (l.getType() === 'hr') {
          this.convertHr(n);
        } else if (l.getType() === 'title') {
          this.convertTitle(n);
        } else if (l.getType() === 'desc') {
          this.convertDescription(n);
        }
      }
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

  convertTextfield(node: any, req: boolean, f: boolean) {
    const fg = this.getFieldGroup(node);
    eval(fg).push(
        {
          key: node.getId(),
          type: 'input',
          id: node.getProperty('id'),
          wrappers: ['grant-field', 'form-field'],
          focus: f,
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
  }

  convertTextarea(node: any, req: boolean, f: boolean) {
    const fg = this.getFieldGroup(node);
    eval(fg).push(
      {
        key: node.getId(),
        id: node.getProperty('id'),
        type: 'textarea',
        wrappers: ['grant-field', 'form-field'],
        focus: f,
        templateOptions: {
          placeholder: node.getProperty('text'),
          description: node.getControls()[0].getAttribute('description'),
          rows: 10,
          label: node.getProperty('text'),
          required: req,
        },
      }
    );
  }

  convertSelect(node: any, req: boolean, f: boolean) {
    const os = node.getChildren();
    const options = [];
    for(let i = 0; i < os.length; i++) {
      const o = {value: i, label: os[i].getProperty('text')};
      options.push(o);
    }
    const fg = this.getFieldGroup(node);
    eval(fg).push(
      {
        key: node.getId(),
        id: node.getProperty('id'),
        type: 'select',
        wrappers: ['grant-field', 'form-field'],
        focus: f,
        templateOptions: {
          placeholder: node.getProperty('text'),
          description: node.getControls()[0].getAttribute('descriptpion'),
          label: node.getProperty('text'),
          required: req,
          options
        },
      }
    );
  }

  convertRadiogroup(node: any, req: boolean, f: boolean) {
    const os = node.getChildren();
    const options: { label: string; value: string; }[] = [];
    for(let i = 0; i < os.length; i++) {
      const o = { label: os[i].getProperty('text'), value: `${i}`};
      options.push(o);
    }
    const fg = this.getFieldGroup(node);
    eval(fg).push(
      {
        key: node.getProperty('text'),
        id: node.getProperty('id'),
        type: 'radio',
        wrappers: ['grant-field', 'form-field'],
        focus: f,
        templateOptions: {
          label: node.getProperty('text'),
          description: node.getControls()[0].getAttribute('description'),
          falseuired: req,
           options: options
        },
      }
    );
  }

  convertCheckbox(node: any, req: boolean, f: boolean) {
    const fg = this.getFieldGroup(node);
    eval(fg).push(
      {
        key: node.getId(),
        id: node.getProperty('id'),
        type: 'checkbox',
        wrappers: ['grant-field', 'form-field'],
        focus: f,
        templateOptions: {
          placeholder: node.getProperty('text'),
          description: node.getControls()[0].getAttribute('description'),
          label: node.getProperty('text'),
          required: req,
        },
      }
    );
  }

  convertKeywords(node: any, req: boolean, f: boolean) {
    const fg = this.getFieldGroup(node);
    eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'keywords',
          wrappers: ['grant-field', 'form-field'],
          focus: f,
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
  }

  convertTime(node: any, req: boolean, f: boolean) {
    const fg = this.getFieldGroup(node);
    eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'time',
          wrappers: ['grant-field', 'form-field'],
          focus: f,
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
  }

  convertAddress(node: any, req: boolean, f: boolean) {
    const fg = this.getFieldGroup(node);
    eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'address',
          wrappers: ['grant-field', 'form-field'],
          focus: f,
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
  }

  convertEditor(node: any, req: boolean, f: boolean) {
    const fg = this.getFieldGroup(node);
    eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'editor',
          wrappers: ['grant-field', 'form-field'],
          focus: f,
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
  }

  convertCalendar(node: any, req: boolean, f: boolean): void {
    const fg = this.getFieldGroup(node);
    eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'date',
          wrappers: ['grant-field', 'form-field'],
          focus: f,
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
  }

  convertRating(node: any, req: boolean, f: boolean): void {
    const fg = this.getFieldGroup(node);
    eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'rating',
          wrappers: ['grant-field', 'form-field'],
          focus: f,
          props: {
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
  }

  convertMulticheckbox(node: any, req: boolean, f: boolean) {
    const os = node.getChildren();
    const options = [];
    for(let i = 0; i < os.length; i++) {
      const o = {value: i, label: os[i].getProperty('text')};
      options.push(o);
    }
    const fg = this.getFieldGroup(node);
    eval(fg).push(
      {
        key: node.getId(),
        id: node.getProperty('id'),
        type: 'multicheckbox',
        wrappers: ['grant-field', 'form-field'],
        focus: f,
        templateOptions: {
          placeholder: node.getProperty('text'),
          description: node.getControls()[0].getAttribute('description'),
          label: node.getProperty('text'),
          required: req,
          options
        },
      }
    );
  }

  convertMultiselect(node: any, req: boolean, f: boolean) {
    const os = node.getChildren();
    const options = [];
    for(let i = 0; i < os.length; i++) {
      const o = {value: i, label: os[i].getProperty('text')};
      options.push(o);
    }
    const fg = this.getFieldGroup(node);
    eval(fg).push(
      {
        key: node.getId(),
        id: node.getProperty('id'),
        type: 'multiselect',
        wrappers: ['grant-field', 'form-field'],
        focus: f,
        templateOptions: {
          placeholder: node.getProperty('text'),
          description: node.getControls()[0].getAttribute('description'),
          label: node.getProperty('text'),
          required: req,
          options
        },
      }
    );
  }

  convertDescription(node: any): void {
    eval(this.getFieldGroup(node)).push(
      {
        template: `<div>${node.getProperty('text') as string}</div>`,
        fieldGroup: []
     }
    );
  }

  convertHr(node: any): void {
    eval(this.getFieldGroup(node)).push(
      {
        template: '<hr/>',
        fieldGroup: []
     }
    );
  }

  convertTitle(node: any): void {
    eval(this.getFieldGroup(node)).push(
      {
        template: `<h2>${node.getProperty('text') as string}</h2>`,
        fieldGroup: []
     }
    );
  }


  submit() {
    this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
      const fd = res.body;
      const a = {...JSON.parse(fd.map), ...this.model};
      fd.map = JSON.stringify(a);
      const b = {...JSON.parse(fd.grant), ...this.grant};
      fd.grant = JSON.stringify(b);
      fd.modified = dayjs();
      fd.user = this.user;
      this.formulaDataService.update(fd).subscribe();
    });
  }

  grantChange(event: any) {
    this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
      const fd = res.body;
      const b = {...JSON.parse(fd.grant), ...this.grant};
      fd.grant = JSON.stringify(b);
      fd.modified = dayjs();
      fd.user = this.user;
      this.formulaDataService.update(fd).subscribe();
    })
  }

  groupChange(event: any) {
    this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
      const fd = res.body;
      const b = {...JSON.parse(fd.group), ...this.group};
      fd.group = JSON.stringify(b);
      fd.modified = dayjs();
      fd.user = this.user;
      this.formulaDataService.update(fd).subscribe();
    })
  }

  modelChange(event: any) {
    this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
      const fd = res.body
      const a = {...JSON.parse(fd.map), ...this.model}
      fd.map = JSON.stringify(a)
      fd.modified = dayjs()
      fd.user = this.user;
      this.formulaDataService.update(fd).subscribe()
    })
  }
}
