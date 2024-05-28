import { UserService } from 'app/entities/user/user.service';
import { IUser } from 'app/entities/user/user.model';
import { FormulaDataService } from './../entities/formula-data/service/formula-data.service';
import { FormulaData } from './../entities/formula-data/formula-data.model';
import dayjs from 'dayjs/esm';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { LoginService } from 'app/login/login.service';
import { KeyTableService } from 'app/entities/key-table/service/key-table.service';
import { KeyTable } from 'app/entities/key-table/key-table.model';
import { GrantsLevel } from 'app/entities/grants-level/grants-level.model';
import { GrantsLevelService } from 'app/entities/grants-level/service/grants-level.service';
import { VisibilityStatus } from 'app/entities/visibility-status/visibility-status.model';
import PersistenceManager from '@wisemapping/mindplot';
import { EMPTY, map, switchMap, take } from 'rxjs';
import { FieldGroup, createFieldGroup } from 'app/field-group.utils';

@Component({
  selector: 'jhi-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  json: {};
  account: Account | null = null;
  user: IUser;
  formId: string;

  fields: FormlyFieldConfig[] = [];
  fieldIds: string[] = [];
  formatedXml: any;
  level = 0;
  levels: Map<string, number> = new Map();
  breadth = 0;
  topics: any;
  index = 0;

  @Input() userId: string;
  @Input() mapId: string;
  @Input() xml: string;
  @Input() id: string;

  constructor(
    private accountService: AccountService,
    private formulaDataService: FormulaDataService,
    private grantsLevelService: GrantsLevelService,
    private maincontrollerService: MaincontrollerService,
    private userService: UserService,
    private loginService: LoginService,
    private mindmapService: MindmapService,
    private keyTableService: KeyTableService,
    private cd: ChangeDetectorRef
  ) {}

  getFieldGroup(level: number): string {
    const arr: string[] = [];
    const group = 'this.fields';
    arr[0] = group;
    for (let i = 0; i < level; i++) {
      arr[i + 1] = arr[i] + '[' + arr[i] + '.length - 1].fieldGroup';
    }
    return arr[arr.length - 1];
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(
      (account) => {
        this.account = account;
        if (this.account) {
          this.userService.query().subscribe((users) => {
            this.user = users.body.find((x) => x.id === this.account.id);
            this.maincontrollerService.findFormulaDataByUserId(account.id).subscribe(res => {
              const fd = res.body;
              if (fd && fd.map) {
                this.model = JSON.parse(JSON.stringify(fd.map));
                if (this.xml) {
                  this.generateFormlyFields();
                  this.cd.markForCheck();
                }
              }
            });
          });
        } else {
          this.loginService.login();
        }
      },
      (error) => {
        // Handle error
        console.error('Error fetching account:', error);
      }
    );
  }
  generateFormlyFields() {
    if (this.xml) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.xml, 'text/xml');
      this.topics = xmlDoc.getElementsByTagName('topic');

      if (this.topics && this.topics.length > 0) {
        const rootFieldGroup = createFieldGroup(this.topics[0], true);
        this.fields = [rootFieldGroup];
        this.fieldIds = [rootFieldGroup.id];
        this.breadth = 1;
        this.levels.set(rootFieldGroup.id, 0);
        this.level = 0;
      }
    }
  }



  convertTextfield(node: any, req: boolean, key?: number, parentFieldGroup?: FieldGroup): void {
    const fieldConfig: FieldGroup = {
      key: key,
      type: 'input',
      wrappers: ['grants'],
      className: 'form-field',
      id: node.getAttribute('id'),
      templateOptions: {
        placeholder: node.getAttribute('text'),
        description: node.getAttribute('descriptpion'),
        label: node.getAttribute('text'),
        required: req,
      },
      fieldGroup: [],
    };

    const newFieldGroup: FieldGroup = {
      templateOptions: {
        label: node.getAttribute('text'),
        placeholder: node.getAttribute('text'),
        description: node.getAttribute('descriptpion'),
        required: req,
      },
      fieldGroup: [fieldConfig],
    };

    if (parentFieldGroup) {
      parentFieldGroup.fieldGroup.push(newFieldGroup);
    } else {
      this.fields.push(newFieldGroup);
    }
  }

  convertTopLevelNodes(rootNode: any): void {
    const topLevelNodes = rootNode.children;

    topLevelNodes.forEach(node => {
      const topLevelFieldGroup: FieldGroup = {
        templateOptions: { label: node.getAttribute('text') },
        fieldGroup: [],
      };

      // Iterieren über die untergeordneten Knoten und konvertieren
      node.children.forEach(childNode => {
        if (childNode.tagName === 'textfield') {
          this.convertTextfield(childNode, false, childNode.getAttribute('id') as number, topLevelFieldGroup);
        } else if (childNode.tagName === 'textarea') {
          this.convertTextarea(childNode, false, childNode.getAttribute('id') as number, topLevelFieldGroup);
        } else if (childNode.tagName === 'editor') {
          this.convertEditor(childNode, false, childNode.getAttribute('id') as number, topLevelFieldGroup);
        }
      });

      this.fields.push(topLevelFieldGroup);
    });
  }

  parseJSON(node) {
    // ...
    this.convertTopLevelNodes(node);
  }

  addDynamicFormlyPage(node: any): void {
    console.log('add_formly');
  }

  convertDescription(node: any): void {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        template: `<div>${node.getAttribute('text') as string}</div>`,
        fieldGroup: []
     }
    );
  }
  convertCalendar(node: any, req: boolean, key?: number, parentFieldGroup?: FieldGroup): void {
    const newFieldGroup: FieldGroup = {
      key: key,
      type: 'date',
      wrappers: ['grants'],
      className: 'form-field',
      id: node.getAttribute('id'),
      templateOptions: {
        placeholder: node.getAttribute('text'),
        description: node.getAttribute('descriptpion'),
        label: node.getAttribute('text'),
        required: req,
        type: 'date',
      },
      fieldGroup: [],
    };

    if (parentFieldGroup) {
      parentFieldGroup.fieldGroup.push(newFieldGroup);
    } else {
      this.fields.push(newFieldGroup);
    }
  }


  /*
  convertCalendar(node: any, req: boolean, key?: number): void {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: key,
          type: 'date',
          wrappers: ['grants'],
          className: 'form-field',
          id: node.getAttribute('id'),
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.getAttribute('descriptpion'),
            label: node.getAttribute('text'),
            required: req,
          },
        }
      );
  }
*/

  convertHr(node: any): void {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        template: '<hr/>',
        fieldGroup: []
     }
    );
  }

  convertTitle(node: any): void {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        template: `<h2>${node.getAttribute('text') as string}</h2>`,
        fieldGroup: []
     }
    );
  }

  convertMultistepForm(node: any) {
    // eslint-disable-next-line no-eval
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
          {
            type: 'stepper',
            wrappers: ['expansion'],
            id: node.getAttribute('id'),
            templateOptions: {
              label: node.getAttribute('text'),
              bgColor: node.getAttribute('bgColor')
            },
            fieldGroup: []
         }
    );
  }

  convertStep(node: any) {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        templateOptions: { label: node.getAttribute('text') },
        fieldGroup: []
      }
    );
  }

  convertTabsForm(node: any) {
    const font = node.getAttribute('fontStyle').split(';;');
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        type: 'tabs',
        wrappers: ['expansion'],
        id: node.getAttribute('id'),
        templateOptions: {
          label: node.getAttribute('text'),
          bgColor: node.getAttribute('bgColor'),
          color: font[1]
        },
        fieldGroup: []
      }
    );
  }

  convertTab(node: any) {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        templateOptions: { label: node.getAttribute('text') },
        fieldGroup: []
      }
    );
  }
/*
  convertTextfield(node: any, req: boolean, key?: number) {

    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: key,
          type: 'input',
          wrappers: ['grants'],
            className: 'form-field',
          id: node.getAttribute('id'),
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.getAttribute('descriptpion'),
            label: node.getAttribute('text'),
            required: req,
          },
        }
      );
  }
*/

  convertTextarea(node: any, req: boolean, key?: number, topLevelFieldGroup?: FieldGroup) {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        key: key,
        type: 'textarea',
        wrappers: ['grants'],
        className: 'form-field',
        id: node.getAttribute('id'),
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.getAttribute('descriptpion'),
          rows: 10,
          label: node.getAttribute('text'),
          required: req,
        },
      }
    );
  }

  convertEditor(node: any, req: boolean, key?: number, topLevelFieldGroup?: FieldGroup) {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        key: key,
        type: 'quill',
        wrappers: ['grants'],
        className: 'form-field',
        id: node.getAttribute('id'),
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.getAttribute('descriptpion'),
          rows: 10,
          label: node.getAttribute('text'),
          required: req,
        },
      }
    );
  }

  convertSelect(node: any, req: boolean, key?: number) {
    const os = node.children;
    const options = [];
    for(let i = 1; i < os.length; i++) {
      const o = {value: i, label: os[i].getAttribute('text')};
      options.push(o);
    }

    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        key: key,
        type: 'select',
        wrappers: ['grants'],
        className: 'form-field',
        id: node.getAttribute('id'),
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.firstChild.getAttribute('descriptpion'),
          label: node.getAttribute('text'),
          required: req,
          options
        },
      }
    );
  }

  convertRadiogroup(node: any, req: boolean, key?: number) {
    const os = node.children;
    const options: { label: string; value: string; }[] = [];
    for(let i = 1; i < os.length; i++) {
      const o = { label: os[i].getAttribute('text'), value: `${i}`};
      options.push(o);
    }
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        key:  node.getAttribute('id') as string,
        type: 'radio',
        wrappers: ['grants'],
        className: 'form-field',
        id: node.getAttribute('id'),
        templateOptions: {
          label: node.getAttribute('text'),
          required: true,
           options: options
        },
      }
    );
  }

  convertCheckbox(node: any, req: boolean,  key?: number) {

    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        key: key,
        type: 'checkbox',
        wrappers: ['grants'],
        className: 'form-field',
        id: node.getAttribute('id'),
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.firstChild.getAttribute('descriptpion'),
          label: node.getAttribute('text'),
          required: req,
        },
      }
    );
  }

  convertRating(node: any, req: boolean, key?: number) {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        key: key,
        type: 'ratings',
        wrappers: ['grants'],
        className: 'form-field',
        id: node.getAttribute('id'),
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.firstChild.getAttribute('descriptpion'),
          label: node.getAttribute('text'),
          required: req,
        },
      }
    );
  }

  convertKeywords(node: any, req: boolean, key?: number) {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        key: key,
        type: 'keywords',
        wrappers: ['grants'],
        className: 'form-field',
        id: node.getAttribute('id'),
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.firstChild.getAttribute('descriptpion'),
          label: node.getAttribute('text'),
          required: req,
        },
      }
    );
  }


/*
  submit() {
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.userService.query().subscribe(users => {
          this.user = users.body.find(x => x.id === this.account.id)
          this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
            const fd = res.body
            if(fd === null) {
              const formdata: FormulaData = new FormulaData()
              formdata.created = dayjs()
              formdata.map = JSON.stringify(this.model),
              formdata.modified = dayjs()
              formdata.user = this.user
              this.formulaDataService.create(formdata).subscribe()
            } else {
              const a = {...JSON.parse(fd.map), ...this.model}
              fd.map = JSON.stringify(a)
              fd.modified = dayjs()
              this.formulaDataService.update(fd).subscribe()
            }
          })

          this.maincontrollerService.findGrantsLevelByUserId(this.account.id).subscribe(res => {
            const gl = res.body
            if(gl === null) {
              const grantslevel: GrantsLevel = new GrantsLevel()
              grantslevel.created = dayjs()
              grantslevel.map = JSON.stringify(this.model),
              grantslevel.modified = dayjs()
              grantslevel.user = this.user
              this.grantsLevelService.create(grantslevel).subscribe()
            } else {
              const a = {...JSON.parse(gl.map), ...this.model}
              gl.map = JSON.stringify(a)
              gl.modified = dayjs()
              this.grantsLevelService.update(gl).subscribe()
            }
          })

          this.maincontrollerService.findVisibilityStatusByUserId(this.account.id).subscribe(res => {
            const vs = res.body
            if(vs === null) {
              const visibilitys: VisibilityStatus = new VisibilityStatus()
              visibilitys.created = dayjs()
              visibilitys.map = JSON.stringify(this.model),
              visibilitys.modified = dayjs()
              visibilitys.user = this.user
              this.formulaDataService.create(visibilitys).subscribe()
            } else {
              const a = {...JSON.parse(vs.map), ...this.model}
              vs.map = JSON.stringify(a)
              vs.modified = dayjs()
              vs.user = this.user
              this.formulaDataService.update(vs).subscribe()
            }
          })

        })
      } else {
        this.loginService.login()
      }
    },
    error => {
      if(error.status === 401) {
        this.loginService.login()
      }
    })
  }
*/
}

declare global {
  // used in mindplot
  var pm: PersistenceManager;
}
