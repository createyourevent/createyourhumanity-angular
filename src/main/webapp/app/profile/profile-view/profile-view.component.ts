/* eslint-disable no-eval */
import { UserService } from 'app/entities/user/user.service'
import { IUser } from 'app/entities/user/user.model'
import { AfterViewInit, Component, Input, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core'
import { Account } from 'app/core/auth/account.model'
import { AccountService } from 'app/core/auth/account.service'
import { MaincontrollerService } from 'app/maincontroller.service'
import { LoginService } from 'app/login/login.service'
import { ActivatedRoute } from '@angular/router'
import { FriendsService } from 'app/entities/friends/service/friends.service'
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service'
import { FormulaData } from 'app/entities/formula-data/formula-data.model'
import dayjs from 'dayjs/esm'

@Component({
  selector: 'jhi-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements AfterViewInit{


  form = new FormGroup({})
  model: any = {}
  grant: any = {}
  options: FormlyFormOptions = {}
  json: {};
  account: Account | null = null;
  user: IUser;
  formId: string;
  profileUser: IUser;
  key: string;
  isFriend = false;

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
              private route: ActivatedRoute,
              private friendsService: FriendsService) {}

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
    const profileId = this.route.snapshot.queryParamMap.get('userId');
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.userService.query().subscribe(users => {
          this.profileUser = users.body.find(x => x.id === profileId);
          this.user = users.body.find(x => x.id === this.account.id);
          this.maincontrollerService.findFriendsByFriendIdAndUser(this.profileUser.id, this.user.id).subscribe(f => {
            if(f) {
              this.isFriend = true;
            }
            this.maincontrollerService.findFormulaDataByUserId(profileId).subscribe(res => {
              const fd = res.body;
              this.model = JSON.parse(fd.map);
              this.grant = JSON.parse(fd.grant);
              this.convert();
            })
          });
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
      if(JSON.parse(node.firstChild.getAttribute('required')) !== null) {
        req = JSON.parse(node.firstChild.getAttribute('required'));
      }
      req = JSON.parse(node.firstChild.getAttribute('required'));
      this.key = node.getAttribute('id') as string;

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
            this.convertTextfield(n, req);
          } else if (n.firstElementChild.tagName === 'textarea') {
            this.convertTextarea(n, req);
          } else if (n.firstElementChild.tagName === 'select') {
            this.convertSelect(n, req);
          } else if (n.firstElementChild.tagName === 'option') {
            console.log('option');
          } else if (n.firstElementChild.tagName === 'radiogroup') {
            this.convertRadiogroup(n, req);
          } else if (n.firstElementChild.tagName === 'radio') {
            console.log('radio');
          } else if (n.firstElementChild.tagName === 'checkbox') {
            this.convertCheckbox(n, req);
          } else if (n.firstElementChild.tagName === 'hr') {
            this.convertHr(n);
          } else if (n.firstElementChild.tagName === 'title') {
            this.convertTitle(n);
          } else if (n.firstElementChild.tagName === 'desc') {
            this.convertDescription(n);
          } else if (n.firstElementChild.tagName === 'calendar') {
            this.convertCalendar(n, req);
          } else if (n.firstElementChild.tagName === 'editor') {
            this.convertEditor(n, req);
          } else if (n.firstElementChild.tagName === 'time') {
            this.convertTime(n, req);
          } else if (n.firstElementChild.tagName === 'address') {
            this.convertAddress(n, req);
          } else if (n.firstElementChild.tagName === 'keywords') {
            this.convertKeywords(n, req);
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
    if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && this.isFriend) || this.grant[this.key] !== 'NONE') {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: _key,
          type: 'input',
          wrappers: ['form-field'],
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.getAttribute('descriptpion'),
            label: node.getAttribute('text'),
            required: req,
          },
        }
      );
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['form-field'],
          fieldGroup: []
       }
      );
    }
  }

  convertTextarea(node: any, req: boolean, key?: string) {
    if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && this.isFriend) || this.grant[this.key] !== 'NONE') {
      let _key = '';
      if(key) {
        _key = key;
      } else {
        _key = node.firstChild.getAttribute('key');
      }
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: _key,
          type: 'textarea',
          wrappers: ['form-field'],
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.getAttribute('descriptpion'),
            rows: 10,
            label: node.getAttribute('text'),
            required: req,
          },
        }
      );
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['form-field'],
          fieldGroup: []
       }
      );
    }
  }

  convertSelect(node: any, req: boolean, key?: string) {
    if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && this.isFriend) || this.grant[this.key] !== 'NONE') {
      const os = node.children;
      const options = [];
      for(let i = 1; i < os.length; i++) {
        const o = {value: i, label: os[i].getAttribute('text')};
        options.push(o);
      }
      let _key = '';
      if(key) {
        _key = key;
      } else {
        _key = node.firstChild.getAttribute('key');
      }
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: _key,
          type: 'select',
          wrappers: ['form-field'],
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.firstChild.getAttribute('descriptpion'),
            label: node.getAttribute('text'),
            required: req,
            options
          },
        }
      );
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['form-field'],
          fieldGroup: []
       }
      );
    }
  }

  convertRadiogroup(node: any, req: boolean, key?: string) {
    if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && this.isFriend) || this.grant[this.key] !== 'NONE') {
    const os = node.children;
    const options: { label: string; value: string; }[] = [];
    for(let i = 1; i < os.length; i++) {
      const o = { label: os[i].getAttribute('text'), value: `${i}`};
      options.push(o);
    }
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
      {
        key: node.getAttribute('text'),
        type: 'radio',
        wrappers: ['form-field'],
        templateOptions: {
          label: node.getAttribute('text'),
          required: req,
           options: options
        },
      }
    );
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['form-field'],
          fieldGroup: []
       }
      );
    }
  }

  convertCheckbox(node: any, req: boolean,  key?: string) {
    if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && this.isFriend) || this.grant[this.key] !== 'NONE') {
      let _key = '';
      if(key) {
        _key = key;
      } else {
        _key = node.firstChild.getAttribute('key');
      }
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: _key,
          type: 'checkbox',
          wrappers: ['form-field'],
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.firstChild.getAttribute('descriptpion'),
            label: node.getAttribute('text'),
            required: req,
          },
        }
      );
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['form-field'],
          fieldGroup: []
       }
      );
    }
  }

  convertKeywords(node: any, req: boolean, key?: string) {
    if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && this.isFriend) || this.grant[this.key] !== 'NONE') {
      let _key = '';
      if(key) {
        _key = key;
      } else {
        _key = node.firstChild.getAttribute('key');
      }
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
          {
            key: _key,
            type: 'keywords',
            wrappers: ['form-field'],
            templateOptions: {
              placeholder: node.getAttribute('text'),
              description: node.getAttribute('descriptpion'),
              label: node.getAttribute('text'),
              required: req,
            },
          }
        );
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['form-field'],
          fieldGroup: []
       }
      );
    }
  }

  convertTime(node: any, req: boolean, key?: string) {
    if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && this.isFriend) || this.grant[this.key] !== 'NONE') {
      let _key = '';
      if(key) {
        _key = key;
      } else {
        _key = node.firstChild.getAttribute('key');
      }
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
          {
            key: _key,
            type: 'time',
            wrappers: ['form-field'],
            templateOptions: {
              placeholder: node.getAttribute('text'),
              description: node.getAttribute('descriptpion'),
              label: node.getAttribute('text'),
              required: req,
            },
          }
        );
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['form-field'],
          fieldGroup: []
       }
      );
    }
  }

  convertAddress(node: any, req: boolean, key?: string) {
    if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && this.isFriend) || this.grant[this.key] !== 'NONE') {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: _key,
          type: 'address',
          wrappers: ['form-field'],
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.getAttribute('descriptpion'),
            label: node.getAttribute('text'),
            required: req,
          },
        }
      );
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['form-field'],
          fieldGroup: []
       }
      );
    }
  }

  convertEditor(node: any, req: boolean, key?: string) {
    if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && this.isFriend) || this.grant[this.key] !== 'NONE') {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: _key,
          type: 'editor',
          wrappers: ['form-field'],
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.getAttribute('descriptpion'),
            label: node.getAttribute('text'),
            required: req,
          },
        }
      );
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['form-field'],
          fieldGroup: []
       }
      );
    }
  }

  convertCalendar(node: any, req: boolean, key?: string): void {
    if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && this.isFriend) || this.grant[this.key] !== 'NONE') {
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
          wrappers: ['form-field'],
          templateOptions: {
            placeholder: node.getAttribute('text'),
            description: node.getAttribute('descriptpion'),
            label: node.getAttribute('text'),
            required: req,
          },
        }
      );
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['form-field'],
          fieldGroup: []
       }
      );
    }
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
              formdata.map = JSON.stringify(this.model)
              formdata.grant = JSON.stringify(this.grant)
              formdata.modified = dayjs()
              formdata.user = this.user
              this.formulaDataService.create(formdata).subscribe()
            } else {
              const a = {...JSON.parse(fd.map), ...this.model}
              fd.map = JSON.stringify(a)
              const b = {...JSON.parse(fd.grant), ...this.grant}
              fd.grant = JSON.stringify(b)
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

  grantChange(event: any) {
    this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
      const fd = res.body
      const b = {...JSON.parse(fd.grant), ...this.grant}
      fd.grant = JSON.stringify(b)
      fd.modified = dayjs()
      this.formulaDataService.update(fd).subscribe()
    })
  }

  modelChange(event: any) {
    this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
      const fd = res.body
      const a = {...JSON.parse(fd.map), ...this.model}
      fd.map = JSON.stringify(a)
      fd.modified = dayjs()
      this.formulaDataService.update(fd).subscribe()
    })
  }
}
