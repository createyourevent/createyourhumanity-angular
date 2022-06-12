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
import { SelectItem } from 'primeng/api'

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
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,
              private loginService: LoginService,
              private route: ActivatedRoute,) {}

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
        this.maincontrollerService.findAllUsersWithFormulaDataAndFriends().subscribe(users => {
          this.profileUser = users.body.find(x => x.id === profileId);
          this.user = users.body.find(x => x.id === this.account.id);

          this.maincontrollerService.findFormulaDataByUserId(profileId).subscribe(res => {
            const fd = res.body;
            this.model = JSON.parse(fd.map);
            this.grant = JSON.parse(fd.grant);
            this.convert();
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
      let req = true;
      let isFriend = false;
      const found = this.user.friends.find(x => x.friendId === this.profileUser.id);
      if(found) {
        isFriend = true;
      }
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
              this.convertTextfield(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'textarea') {
              this.convertTextarea(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'select') {
              this.convertSelect(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'radiogroup') {
              this.convertRadiogroup(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'checkbox') {
              this.convertCheckbox(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'hr') {
              this.convertHr(n);
            } else if (n.firstElementChild.tagName === 'title') {
              this.convertTitle(n);
            } else if (n.firstElementChild.tagName === 'desc') {
              this.convertDescription(n);
            } else if (n.firstElementChild.tagName === 'calendar') {
              this.convertCalendar(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'editor') {
              this.convertEditor(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'time') {
              this.convertTime(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'address') {
              this.convertAddress(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'keywords') {
              this.convertKeywords(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'ratings') {
              this.convertRating(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'multicheckbox') {
              this.convertMulticheckbox(n, req, this.key, isFriend);
            } else if (n.firstElementChild.tagName === 'multiselectbox') {
              this.convertMultiselect(n, req, this.key, isFriend);
            }
          }
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

  convertTextfield(node: any, req: boolean, key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend)) {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
          {
            key: _key,
            type: 'textfield-summary',
            wrappers: ['profile-field'],
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
            wrappers: ['profile-field'],
            fieldGroup: []
          }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertTextarea(node: any, req: boolean, key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
        eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
          {
            key: _key,
            type: 'textarea-summary',
            wrappers: ['profile-field'],
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertSelect(node: any, req: boolean, key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
        const os = node.children;
        const options = [];
        for(let i = 1; i < os.length; i++) {
          const o = {value: i, label: os[i].getAttribute('text')};
          options.push(o);
        }
        eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
          {
            key: _key,
            type: 'select-summary',
            wrappers: ['profile-field'],
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertRadiogroup(node: any, req: boolean, key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
      const os = node.children;
      const options: { label: string; value: string; }[] = [];
      for(let i = 1; i < os.length; i++) {
        const o = { label: os[i].getAttribute('text'), value:   os[i].getAttribute('text')};
        options.push(o);
      }
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          key: node.getAttribute('text'),
          type: 'radiogroup-summary',
          wrappers: ['profile-field'],
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertCheckbox(node: any, req: boolean,  key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
        eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
          {
            key: _key,
            type: 'checkbox',
            wrappers: ['profile-field'],
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertKeywords(node: any, req: boolean, key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
        const os = node.children;
        const options = [];
        for(let i = 1; i < os.length; i++) {
          const o = {value: i, label: os[i].getAttribute('text')};
          options.push(o);
        }
        eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
            {
              key: _key,
              type: 'keywords-summary',
              wrappers: ['profile-field'],
              templateOptions: {
                placeholder: node.getAttribute('text'),
                description: node.getAttribute('descriptpion'),
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertTime(node: any, req: boolean, key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
        eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
            {
              key: _key,
              type: 'time-summary',
              wrappers: ['profile-field'],
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertAddress(node: any, req: boolean, key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
          {
            key: _key,
            type: 'address-summary',
            wrappers: ['profile-field'],
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertEditor(node: any, req: boolean, key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
          {
            key: _key,
            type: 'editor-summary',
            wrappers: ['profile-field'],
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertCalendar(node: any, req: boolean, key?: string, isFriend?: boolean): void {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
          {
            key: _key,
            type: 'date',
            wrappers: ['profile-field'],
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertRating(node: any, req: boolean, key?: string, isFriend?: boolean): void {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
        eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
            {
              key: _key,
              type: 'rating-summary',
              wrappers: ['profile-field'],
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
              wrappers: ['profile-field'],
              fieldGroup: []
          }
          );
        }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertMulticheckbox(node: any, req: boolean, key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
        const os = node.children;
        const options: SelectItem[] = [];
        for(let i = 1; i < os.length; i++) {
          const o = {value: i, label: os[i].getAttribute('text')};
          options.push(o);
        }
        eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
            {
              key: _key,
              type: 'multicheckbox-summary',
              wrappers: ['profile-field'],
              templateOptions: {
                placeholder: node.getAttribute('text'),
                description: node.getAttribute('descriptpion'),
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }

  convertMultiselect(node: any, req: boolean, key?: string, isFriend?: boolean) {
    let _key = '';
    if(key) {
      _key = key;
    } else {
      _key = node.firstChild.getAttribute('key');
    }
    const val = this.model[_key];
    if(val) {
      if(this.grant[this.key] === 'ALL' || (this.grant[this.key] === 'FRIENDS' && isFriend) || this.grant[this.key] !== 'NONE') {
        const os = node.children;
        const options: SelectItem[] = [];
        for(let i = 1; i < os.length; i++) {
          const o = {value: i, label: os[i].getAttribute('text')};
          options.push(o);
        }
        eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
            {
              key: _key,
              type: 'multiselect-summary',
              wrappers: ['profile-field'],
              templateOptions: {
                placeholder: node.getAttribute('text'),
                description: node.getAttribute('descriptpion'),
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
            wrappers: ['profile-field'],
            fieldGroup: []
        }
        );
      }
    } else {
      eval(this.getFieldGroup(this.levels.get(node.id) - 1)).push(
        {
          template: `
            <div class="bold">` + node.getAttribute('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    }
  }
}
