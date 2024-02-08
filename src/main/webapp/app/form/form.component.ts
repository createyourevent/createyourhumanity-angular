/* eslint-disable no-eval */
import { UserService } from 'app/entities/user/user.service'
import { IUser } from 'app/entities/user/user.model'
import { FormulaDataService } from './../entities/formula-data/service/formula-data.service'
import { FormulaData } from './../entities/formula-data/formula-data.model'
import dayjs from 'dayjs/esm'
import { AfterViewInit, Component, Input, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core'
import { Account } from 'app/core/auth/account.model'
import { AccountService } from 'app/core/auth/account.service'
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service'
import { MaincontrollerService } from 'app/maincontroller.service'
import { LoginService } from 'app/login/login.service'
import { KeyTableService } from 'app/entities/key-table/service/key-table.service'
import { KeyTable } from 'app/entities/key-table/key-table.model'

@Component({
  selector: 'jhi-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, AfterViewInit{

  form = new FormGroup({})
  model: any = {}
  options: FormlyFormOptions = {}
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

  constructor(private accountService: AccountService,
              private formulaDataService: FormulaDataService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,
              private loginService: LoginService,
              private mindmapService: MindmapService,
              private keyTableService: KeyTableService) {}

  getFieldGroup(level: number): string {
    const arr: string[] = [];
    const group = 'this.fields';
    arr[0] = group;
    for(let i = 0; i < level; i++) {
      arr[i + 1] = arr[i] + '[' + arr[i] + '.length - 1].fieldGroup'
    }
    return arr[arr.length - 1];
  }

  ngAfterViewInit(): void {
    this.convert();
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.userService.query().subscribe(users => {
          this.user = users.body.find(x => x.id === this.account.id)
          this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
            const fd = res.body;
            this.model = JSON.parse(fd.map);
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
    this.maincontrollerService.deleteAllFromKeyTable();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this.xml,"text/xml");
    this.topics = xmlDoc.getElementsByTagName("topic");
    for(let i = 0; i < this.topics.length; i++) {
      if (this.topics[i].hasChildNodes()) {
        this.topics[i].childNodes.forEach(child => {
          if(child.tagName !== 'topic') {
            this.topics[i].removeChild(child)
          }
        });
      }
    }
  }

  convert() {
    this.walkTheDOM(this.topics[0]);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this.xml,"text/xml");
    this.topics = xmlDoc.getElementsByTagName("topic");
    this.domWalker(this.topics[0]);
    this.fields = this.fields.splice(0);
    }

    domWalker (node) {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
      do {
        const e: HTMLElement = walker.currentNode as HTMLElement;
        if(e.tagName !== 'topic') {
          continue;
        } else {
          this.parseJSON(e);
        }
      } while (walker.nextNode());
    }

    walkTheDOM(node) {
      const found = this.fieldIds.findIndex(x => x === node.id);
      if(found < 0 ) {
          this.levels.set(node.id, this.level);
          this.fieldIds.push(node.id);
          this.level++;
      }
      node = node.firstChild;
      while (node) {
          this.walkTheDOM(node);
          this.level = this.levels.get(node.id);
          node = node.nextSibling;
      }
  }

  parseJSON(node) {
      const n = node;
      let req = false;
      if(node.firstChild) {
        if(JSON.parse(node.firstChild.getAttribute('required')) !== null) {
          req = JSON.parse(node.firstChild.getAttribute('required'));
        }
        req = JSON.parse(node.firstChild.getAttribute('required'));
      }
      let key: string = node.getAttribute('id') as string;
      /*
      let key: string = node.getAttribute('text').toLowerCase();
      this.maincontrollerService.findKeyTableByKey(key).subscribe(res => {
        const kt = res.body;
        if(!kt) {
          const keyTable = new KeyTable();
          keyTable.key = node.getAttribute('text').toLowerCase();
          keyTable.created = dayjs();
          keyTable.modified = dayjs();
          this.keyTableService.create(keyTable).subscribe();
        } else {
          key = key + '_' + node.getAttribute('id') as string;
        }
        */
        if(n.firstElementChild) {
          if (n.firstElementChild.tagName === 'htmlForm' && n.firstElementChild.id === 'form') {
            this.addDynamicFormlyPage(n);
          } else if (n.firstElementChild.tagName === 'htmlForm' && n.firstElementChild.id === 'multi_step_form') {
            this.convertMultistepForm(n);
          } else if (n.firstElementChild.tagName === 'htmlForm' && n.firstElementChild.id === 'tabs_form') {
            this.convertTabsForm(n);
          } else if (n.firstElementChild.tagName === 'htmlFormStep') {
            this.convertStep(n);
            this.index = 0;
          } else if (n.firstElementChild.tagName === 'htmlFormTab') {
            this.convertTab(n);
          } else if (n.firstElementChild.tagName === 'textfield') {
            this.convertTextfield(n, req, key);
          } else if (n.firstElementChild.tagName === 'textarea') {
            this.convertTextarea(n, req, key);
          } else if (n.firstElementChild.tagName === 'select') {
            this.convertSelect(n, req, key);
          } else if (n.firstElementChild.tagName === 'option') {
            console.log('option');
          } else if (n.firstElementChild.tagName === 'radiogroup') {
            this.convertRadiogroup(n, req, key);
          } else if (n.firstElementChild.tagName === 'radio') {
            console.log('radio');
          } else if (n.firstElementChild.tagName === 'checkbox') {
            this.convertCheckbox(n, req, key);
          } else if (n.firstElementChild.tagName === 'hr') {
            this.convertHr(n);
          } else if (n.firstElementChild.tagName === 'title') {
            this.convertTitle(n);
          } else if (n.firstElementChild.tagName === 'desc') {
            this.convertDescription(n);
          } else if (n.firstElementChild.tagName === 'calendar') {
            this.convertCalendar(n, req);
          }
        }
        /*
    });
    */
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

  convertCalendar(node: any, req: boolean, key?: string): void {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: _key,
          type: 'date',
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.getAttribute('descriptpion'),
            label: node.getAttribute('text'),
            required: req,
          },
        }
      );
  }

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
            wrappers: ['panel'],
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
        wrappers: ['panel'],
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

  convertTextfield(node: any, req: boolean, key?: string) {

    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: key,
          type: 'input',
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.getAttribute('descriptpion'),
            label: node.getAttribute('text'),
            required: req,
          },
        }
      );
  }

  convertTextarea(node: any, req: boolean, key?: string) {
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        key: key,
        type: 'textarea',
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

  convertSelect(node: any, req: boolean, key?: string) {
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

  convertRadiogroup(node: any, req: boolean, key?: string) {
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
        className: '',
        templateOptions: {
          label: node.getAttribute('text'),
          required: true,
           options: options
        },
      }
    );
  }

  convertCheckbox(node: any, req: boolean,  key?: string) {

    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        key: key,
        type: 'checkbox',
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.firstChild.getAttribute('descriptpion'),
          label: node.getAttribute('text'),
          required: req,
        },
      }
    );
  }



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

}
