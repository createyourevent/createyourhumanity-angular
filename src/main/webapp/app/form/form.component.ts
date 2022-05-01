import { UserMindmap } from 'app/entities/user-mindmap/user-mindmap.model';
import { UserService } from 'app/entities/user/user.service'
import { IUser } from 'app/entities/user/user.model'
import { FormulaDataService } from './../entities/formula-data/service/formula-data.service'
import { FormulaData } from './../entities/formula-data/formula-data.model'
import dayjs from 'dayjs/esm'
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core'
import { Account } from 'app/core/auth/account.model'
import { AccountService } from 'app/core/auth/account.service'
import { Mindmap } from 'app/entities/mindmap/mindmap.model'
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service'
import { MaincontrollerService } from 'app/maincontroller.service'
import { LoginService } from 'app/login/login.service'

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

  fieldGroup: FormlyFieldConfig[] = [];
  fieldId: number[] = [];
  formatedXml: any;
  level = 0;
  levels: Map<string, number> = new Map();
  breadth = 0;
  topics: any;

  @Input() userId: string;
  @Input() mapId: string;
  @Input() xml: string;
  @Input() id: string;


  constructor(private accountService: AccountService,
              private formulaDataService: FormulaDataService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,
              private mindmapService: MindmapService,
              private loginService: LoginService) {}
  ngAfterViewInit(): void {
    this.convert();
  }

  ngOnInit(): void {
    const parser = new DOMParser();
    this.xml = this.xml.substring('<htmlForm id="form"/>"'.length -1, this.xml.length);
    const xmlDoc = parser.parseFromString(this.xml,"text/xml");
    this.topics = xmlDoc.getElementsByTagName("topic");
  }

  convert() {
    this.domWalker(this.topics[0]);
    this.fieldGroup = this.fieldGroup.splice(0);
    }

    domWalker (node) {
      const found = this.fieldId.findIndex(x => x === Number(node.getAttribute("id")));
      if(found < 0) {
        this.levels.set(node.getAttribute('id'), this.level);
        this.fieldId.push(Number(node.getAttribute("id")));
        this.parseJSON(node);
        this.level++;
      } else {
        this.level = this.levels.get(node.getAttribute('id'));
      }
      node = node.firstElementChild;
      while(node) {
        this.domWalker(node);
        node = node.nextElementSibling;
      }
    }

  parseJSON(node) {
      const n = node;
      if(node.firstElementChild){
        if (n.firstElementChild.tagName === 'htmlForm' && n.firstElementChild.id === 'form') {
          this.addDynamicFormlyPage(n);
        } else if (n.firstElementChild.tagName === 'htmlForm' && n.firstElementChild.id === 'multi_step_form') {
          this.convertMultistepForm(n);
        } else if (n.firstElementChild.tagName === 'htmlForm' && n.firstElementChild.id === 'tabs_form') {
          this.convertTabsForm(n);
        } else if (n.firstElementChild.tagName === 'htmlFormStep') {
          this.convertStep(n);
        } else if (n.firstElementChild.tagName === 'htmlFormTab') {
          this.convertTab(n);
        } else if (n.firstElementChild.tagName === 'container') {
          this.convertContainer(n);
        } else if (n.firstElementChild.tagName === 'row') {
          this.convertRow(n);
        } else if (n.firstElementChild.tagName === 'column') {
          this.convertColumn(n);
        } else if (n.firstElementChild.tagName === 'textfield') {
          this.convertTextfield(n);
        } else if (n.firstElementChild.tagName === 'textarea') {
          this.convertTextarea(n);
        } else if (n.firstElementChild.tagName === 'select') {
          this.convertSelect(n);
        } else if (n.firstElementChild.tagName === 'option') {
          console.log('option');
        } else if (n.firstElementChild.tagName === 'radiogroup') {
          this.convertRadiogroup(n);
        } else if (n.firstElementChild.tagName === 'radio') {
          console.log('radio');
        } else if (n.firstElementChild.tagName === 'checkbox') {
          this.convertCheckbox(n);
        }
      }
  }

  addDynamicFormlyPage(node: any): void {
    console.log('add_formly');
  }

  convertMultistepForm(node: any) {
      this.fieldGroup.push(
        {
          type: 'stepper',
          wrappers: ['panel'],
          templateOptions: { label: node.getAttribute('text') },
          fieldGroup: []
        }
      );
  }

  convertStep(node: any) {
    this.fieldGroup[this.level -1].fieldGroup.push(
      {
        templateOptions: { label: node.getAttribute('text') },
        fieldGroup: []
      }
    );
  }

  convertTabsForm(node: any) {
      this.fieldGroup.push(
        {
          type: 'tabs',
          wrappers: ['panel'],
          templateOptions: { label: node.getAttribute('text') },
          fieldGroup: []
        }
      );
  }

  convertTab(node: any) {
    this.fieldGroup[this.fieldGroup.length -1].fieldGroup.push(
      {
        templateOptions: { label: node.getAttribute('text') },
        fieldGroup: []
      }
    );
  }

  convertContainer(node: any) {
    this.fieldGroup.push(
      {
        type: 'container',
        wrappers: ['conainerwrapper'],
        fieldGroup: [],
      }
    );
  }

  convertRow(node: any) {
    this.fieldGroup.push(
      {
        type: 'row',
        wrappers: ['rowwrapper'],
        fieldGroup: [],
      }
    );
  }

  convertColumn(node: any) {
    this.fieldGroup.push(
      {
        type: 'column',
        wrappers: ['columnwrapper'],
        fieldGroup: [],
      }
    );
  }

  convertTextfield(node: any) {
      this.fieldGroup[this.fieldGroup.length -1].fieldGroup[this.fieldGroup[this.fieldGroup.length -1].fieldGroup.length - 1].fieldGroup.push(
        {
          key: node.firstChild.getAttribute('key'),
          type: 'input',
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.getAttribute('descriptpion'),
            label: node.parentElement.getAttribute('text'),
            required: node.firstChild.getAttribute('required')
          },
        }
      );
  }

  convertTextarea(node: any) {
    this.fieldGroup[this.fieldGroup.length -1].fieldGroup[this.fieldGroup[this.fieldGroup.length -1].fieldGroup.length - 1].fieldGroup.push(
      {
        key: node.firstChild.getAttribute('key'),
        type: 'textarea',
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.getAttribute('descriptpion'),
          rows: 10,
          label: node.getAttribute('text'),
          required: node.firstChild.getAttribute('required')
        },
      }
    );
  }

  convertSelect(node: any) {
    const os = node.children;
    const options = [];
    for(let i = 1; i < os.length; i++) {
      const o = {value: i, label: os[i].getAttribute('text')};
      options.push(o);
    }
    this.fieldGroup[this.fieldGroup.length -1].fieldGroup[this.fieldGroup[this.fieldGroup.length -1].fieldGroup.length - 1].fieldGroup.push(
      {
        key: node.getAttribute('key'),
        type: 'select',
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.firstChild.getAttribute('descriptpion'),
          label: node.getAttribute('text'),
          required: node.firstChild.getAttribute('required'),
          options
        },
      }
    );
  }

  convertRadiogroup(node: any) {
    const os = node.children;
    const options = [];
    for(let i = 1; i < os.length; i++) {
      const o = {value: i, label: os[i].getAttribute('text')};
      options.push(o);
    }
    this.fieldGroup[this.fieldGroup.length -1].fieldGroup[this.fieldGroup[this.fieldGroup.length -1].fieldGroup.length - 1].fieldGroup.push(
      {
        key: node.getAttribute('key'),
        type: 'radio',
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.firstChild.getAttribute('descriptpion'),
          label: node.getAttribute('text'),
          required: node.firstChild.getAttribute('required'),
          options
        },
      }
    );
  }

  convertCheckbox(node: any) {
    this.fieldGroup[this.fieldGroup.length -1].fieldGroup[this.fieldGroup[this.fieldGroup.length -1].fieldGroup.length - 1].fieldGroup.push(
      {
        key: node.firstChild.getAttribute('key'),
        type: 'checkbox',
        templateOptions: {
          placeholder: node.getAttribute('text'),
          description: node.firstChild.getAttribute('descriptpion'),
          label: node.getAttribute('text'),
          required: node.firstChild.getAttribute('required')
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
              formdata.map = this.model
              formdata.modified = dayjs()
              formdata.user = this.user
              this.formulaDataService.create(formdata).subscribe()
            } else {
              fd.map = this.model
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
