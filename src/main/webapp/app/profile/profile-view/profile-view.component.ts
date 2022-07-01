/* eslint-disable no-eval */
import { IUser } from 'app/entities/user/user.model'
import { Component, Input, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core'
import { Account } from 'app/core/auth/account.model'
import { AccountService } from 'app/core/auth/account.service'
import { MaincontrollerService } from 'app/maincontroller.service'
import { Designer, Topic} from '@wisemapping/mindplot';
import { IFriends } from 'app/entities/friends/friends.model'

@Component({
  selector: 'jhi-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit {

  form = new FormGroup({})
  model: any = {}
  grant: any = {}
  options: FormlyFormOptions = {}
  json: {};
  account: Account | null = null;
  user: IUser;
  formId: string;
  designer: Designer;
  fields: FormlyFieldConfig[] = [];
  friend: IFriends;
  formatedXml: any;
  level = 0;
  breadth = 0;
  topics: any;
  index = 0;
  _topics: Topic[];
  path: number[] = [];

  @Input() userId: string;
  @Input() mapId: string;
  @Input() topic: string;

  constructor(private accountService: AccountService,
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
        this.account = account;
        if(this.account) {
          this.maincontrollerService.findFriendsByFriendIdAndUser(this.userId, this.account.id).subscribe(fr => {
            this.friend = fr.body[0];
          });
            this.maincontrollerService.findFormulaDataByUserId(this.userId).subscribe(res => {
              const fd = res.body;
              this.model = JSON.parse(fd.map);
              this.grant = JSON.parse(fd.grant);
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
    this.maincontrollerService.findFormulaDataByUserId(this.userId).subscribe(res => {
      const fd = res.body;
      this.model = JSON.parse(fd.map);
      this.grant = JSON.parse(fd.grant);
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
        if(this.friend) {
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
    eval(this.getFieldGroup(node)).push(
      {
        id: node.getProperty('id'),
        fieldGroup: []
      }
    );
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

  convertTextfield(node: any, req: boolean, isFriend: boolean) {
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
          {
            key: node.getId(),
            type: 'textfield-summary',
            wrappers: ['profile-field'],
            id: node.getProperty('id'),
            templateOptions: {
              placeholder: node.getProperty('text'),
              description: node.getControls()[0].getAttribute('description'),
              label: node.getProperty('text'),
              required: req,
            },
          }
        );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertTextarea(node: any, req: boolean, isFriend: boolean) {
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'textarea-summary',
          wrappers: ['profile-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            rows: 10,
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertSelect(node: any, req: boolean, isFriend: boolean) {
    const os = node.getChildren();
    const options = [];
    for(let i = 0; i < os.length; i++) {
      const o = {value: i, label: os[i].getProperty('text')};
      options.push(o);
    }
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'select-summary',
          wrappers: ['profile-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('descriptpion'),
            label: node.getProperty('text'),
            required: req,
            options
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertRadiogroup(node: any, req: boolean, isFriend: boolean) {
    const os = node.getChildren();
    const options: { label: string; value: string; }[] = [];
    for(let i = 0; i < os.length; i++) {
      const o = { label: os[i].getProperty('text'), value: `${i}`};
      options.push(o);
    }
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getProperty('text'),
          id: node.getProperty('id'),
          type: 'radiogroup-summary',
          wrappers: ['profile-field'],
          templateOptions: {
            label: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            falseuired: req,
            options: options
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertCheckbox(node: any, req: boolean, isFriend: boolean) {
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'checkbox',
          wrappers: ['profile-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertKeywords(node: any, req: boolean, isFriend: boolean) {
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'keywords-summary',
          wrappers: ['profile-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertTime(node: any, req: boolean, isFriend: boolean) {
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'time-summary',
          wrappers: ['profile-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertAddress(node: any, req: boolean, isFriend: boolean) {
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'address-summary',
          wrappers: ['profile-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertEditor(node: any, req: boolean, isFriend: boolean) {
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'editor-summary',
          wrappers: ['profile-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertCalendar(node: any, req: boolean, isFriend: boolean): void {
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'date',
          wrappers: ['profile-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertRating(node: any, req: boolean, isFriend: boolean): void {
    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'rating-summary',
          wrappers: ['profile-field'],
          props: {
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertMulticheckbox(node: any, req: boolean, isFriend: boolean) {
    const os = node.getChildren();
    const options = [];
    for(let i = 0; i < os.length; i++) {
      const o = {value: i, label: os[i].getProperty('text')};
      options.push(o);
    }

    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'multicheckbox-summary',
          wrappers: ['profile-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
            options
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
  }

  convertMultiselect(node: any, req: boolean, isFriend: boolean) {
    const os = node.getChildren();
    const options = [];
    for(let i = 0; i < os.length; i++) {
      const o = {value: i, label: os[i].getProperty('text')};
      options.push(o);
    }

    const fg = this.getFieldGroup(node);
    const val = this.model[node.getId()];

    let gra = this.grant[node.getId()];
    if(gra === null || gra === undefined) {
      gra = 'ALL';
    }

    if(val === null || val === undefined || val === '') {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not filled from customer</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
      }
      );
    } else if(gra === 'ALL' || (gra === 'FRIENDS' && isFriend) || (gra === 'NONE' && (this.user.id === this.userId))) {
      eval(fg).push(
        {
          key: node.getId(),
          id: node.getProperty('id'),
          type: 'multiselect-summary',
          wrappers: ['profile-field'],
          templateOptions: {
            placeholder: node.getProperty('text'),
            description: node.getControls()[0].getAttribute('description'),
            label: node.getProperty('text'),
            required: req,
            options
          },
        }
      );
    } else {
      eval(fg).push(
        {
          template: `
            <div class="bold">` + node.getProperty('text') + `</div>
            <hr/>
            <div class="not-visible">Not visible</div>
          `,
          wrappers: ['profile-field'],
          fieldGroup: []
        }
      );
    }
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

}
