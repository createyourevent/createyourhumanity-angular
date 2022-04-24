import { UserService } from 'app/entities/user/user.service';
import { IUser } from 'app/entities/user/user.model';
import { FormulaDataService } from './../entities/formula-data/service/formula-data.service';
import { FormulaData } from './../entities/formula-data/formula-data.model';
import dayjs from 'dayjs/esm';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { MaincontrollerService } from 'app/maincontroller.service';

@Component({
  selector: 'jhi-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit{

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  mindmap: Mindmap;
  json: {};
  account: Account | null = null;
  user: IUser;

  fields: FormlyFieldConfig[] = [];
  formatedXml: any;

  constructor(private xml2json: NgxXml2jsonService,
              private accountService: AccountService,
              private formulaDataService: FormulaDataService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,
              private mindmapService: MindmapService,) {}


  ngOnInit(): void {
    this.mindmapService.query().subscribe(res => {
      if(res.body.length === 1) {
        this.mindmap = res.body[0];
        this.convertXmlToJson();
      }
    });
  }


  convertXmlToJson(): any {
    this.fields = [];
    const parser = new DOMParser();
    const xml = parser.parseFromString(this.mindmap.text, 'text/xml');
    const list = xml.getElementsByTagName("htmlForm");

    // const last = xml.getElementsByTagName("htmlForm")[xml.getElementsByTagName("htmlForm").length - 1];
    for(let j = 0; j < list.length; j++) {
      const form = list[j];
      const type = form.id;
      const parent = form.parentElement;
      const parentchildren = parent.children;

      if(type === 'multi_step_form') {
        const f: FormlyFieldConfig = {
          type: 'stepper',
          wrappers: ['panel'],
          templateOptions: { label: parent.getAttribute('text') },
          fieldGroup: [],
        };
        let child;
        for(let u = 0; u < parent.children.length; u++) {
          child = parent.children[u];
          if(child.id !== type) {
            const add = {
              templateOptions: { label:  child.getAttribute('text')},
              fieldGroup: []
            }
            f.fieldGroup.push(add);
          for(let i = 0; i < child.children.length; i++) {
            const child1 = child.children[i];
            if(child1.id !== type) {
                const fc = child1.firstElementChild;
                if(fc !== null && fc.tagName !== 'htmlFormStep') {
                  const req = (/true/i).test(fc.getAttribute('required'));
                  if(fc.tagName === "textfield") {
                    f.fieldGroup[u-1].fieldGroup.push(
                      {
                        key: fc.getAttribute('key'),
                        type: 'input',
                        templateOptions: {
                          placeholder: child1.getAttribute('text'),
                          description: child1.getAttribute('description'),
                          label: child1.getAttribute('text'),
                          required: req
                        },
                      }
                    );
                    this.fields = this.fields.splice(0);
                  } else if(fc.tagName === "textarea") {
                    f.fieldGroup[u-1].fieldGroup.push(
                      {
                        key: fc.getAttribute('key'),
                        type: 'textarea',
                        templateOptions: {
                          placeholder: child1.getAttribute('text'),
                          label: child1.getAttribute('text'),
                          rows: 10,
                          required: req,
                          description: child1.getAttribute('description'),
                        },
                      }
                    ),
                    this.fields = this.fields.splice(0);
                  } else if(fc.tagName === "radiogroup") {
                    const opts = [];
                    //for(let z = 0; z < fc.parentElement.children.length -1; z++) {
                        const parChildren = fc.parentElement.children;
                        for(let a = 0; a < parChildren.length; a++) {
                          if(fc.parentElement.children[a].tagName === 'topic') {
                          const ch = parChildren[a];
                          opts.push({ value: ch.getAttribute('id'), label: ch.getAttribute('text')});
                        }
                      //}
                    }
                    f.fieldGroup[u-1].fieldGroup.push(
                      {
                        key: fc.getAttribute('key'),
                        type: 'radio',
                        templateOptions: {
                          label: child1.getAttribute('text'),
                          placeholder: child1.getAttribute('text'),
                          description: child1.getAttribute('description'),
                          required: req,
                          options: opts,
                        },
                      }
                    );
                    this.fields = this.fields.splice(0);
                  } else if(fc.tagName === "checkbox") {
                    f.fieldGroup[u-1].fieldGroup.push(
                      {
                        key: fc.getAttribute('key'),
                        type: 'checkbox',
                        templateOptions: {
                          label: child1.getAttribute('text'),
                          description: child1.getAttribute('text'),
                          pattern: 'true',
                          required: req,
                        },
                      }
                    );
                    this.fields = this.fields.splice(0);
                  } else if(fc.tagName === "select") {
                    const opts = [];
                    //for(let z = 0; z < fc.parentElement.children.length -1; z++) {
                        const parChildren = fc.parentElement.children;
                        for(let a = 0; a < parChildren.length; a++) {
                          if(fc.parentElement.children[a].tagName === 'topic') {
                          const ch = parChildren[a];
                          opts.push({ value: ch.getAttribute('id'), label: ch.getAttribute('text')});
                        }
                      //}
                    }
                    f.fieldGroup[u-1].fieldGroup.push(
                      {
                        key: fc.getAttribute('key'),
                        type: 'select',
                        templateOptions: {
                          label: child1.getAttribute('text'),
                          placeholder: child1.getAttribute('text'),
                          description: child1.getAttribute('description'),
                          required: req,
                          options: opts,
                        },
                      }
                    );
                    this.fields = this.fields.splice(0);
                  }
                }
              }
            }
          }
        }
          this.fields.push(f);
      } else if(type === 'tabs_form') {
        const f: FormlyFieldConfig = {
          type: 'tabs',
          wrappers: ['panel'],
          templateOptions: { label: parent.getAttribute('text') },
          fieldGroup: [],
        };
        let child;
        for(let u = 0; u < parent.children.length; u++) {
          child = parent.children[u];
          if(child.id !== type) {
            const add = {
              templateOptions: { label:  child.getAttribute('text')},
              fieldGroup: []
            }
            f.fieldGroup.push(add);
          for(let i = 0; i < child.children.length; i++) {
            const child1 = child.children[i];
            if(child1.id !== type) {
                const fc = child1.firstElementChild;
                if(fc !== null && fc.tagName !== 'htmlFormStep') {
                  const req = (/true/i).test(fc.getAttribute('required'));
                  if(fc.tagName === "textfield") {
                    f.fieldGroup[u-1].fieldGroup.push(
                      {
                        key: fc.getAttribute('key'),
                        type: 'input',
                        templateOptions: {
                          placeholder: child1.getAttribute('text'),
                          description: child1.getAttribute('description'),
                          label: child1.getAttribute('text'),
                          required: req
                        },
                      }
                    );
                    this.fields = this.fields.splice(0);
                  } else if(fc.tagName === "textarea") {
                    f.fieldGroup[u-1].fieldGroup.push(
                      {
                        key: fc.getAttribute('key'),
                        type: 'textarea',
                        templateOptions: {
                          placeholder: child1.getAttribute('text'),
                          label: child1.getAttribute('text'),
                          rows: 10,
                          required: req,
                          description: child1.getAttribute('description'),
                        },
                      }
                    ),
                    this.fields = this.fields.splice(0);
                  } else if(fc.tagName === "radiogroup") {
                    const opts = [];
                    //for(let z = 0; z < fc.parentElement.children.length -1; z++) {
                        const parChildren = fc.parentElement.children;
                        for(let a = 0; a < parChildren.length; a++) {
                          if(fc.parentElement.children[a].tagName === 'topic') {
                          const ch = parChildren[a];
                          opts.push({ value: ch.getAttribute('id'), label: ch.getAttribute('text')});
                        }
                      //}
                    }
                    f.fieldGroup[u-1].fieldGroup.push(
                      {
                        key: fc.getAttribute('key'),
                        type: 'radio',
                        templateOptions: {
                          label: child1.getAttribute('text'),
                          placeholder: child1.getAttribute('text'),
                          description: child1.getAttribute('description'),
                          required: true,
                          options: opts,
                        },
                      }
                    );
                    this.fields = this.fields.splice(0);
                  } else if(fc.tagName === "checkbox") {
                    f.fieldGroup[u-1].fieldGroup.push(
                      {
                        key: fc.getAttribute('key'),
                        type: 'checkbox',
                        templateOptions: {
                          label: child1.getAttribute('text'),
                          description: child1.getAttribute('text'),
                          pattern: 'true',
                          required: req,
                        },
                      }
                    );
                    this.fields = this.fields.splice(0);
                  } else if(fc.tagName === "select") {
                    const opts = [];
                    //for(let z = 0; z < fc.parentElement.children.length -1; z++) {
                        const parChildren = fc.parentElement.children;
                        for(let a = 0; a < parChildren.length; a++) {
                          if(fc.parentElement.children[a].tagName === 'topic') {
                          const ch = parChildren[a];
                          opts.push({ value: ch.getAttribute('id'), label: ch.getAttribute('text')});
                        }
                      //}
                    }
                    f.fieldGroup[u-1].fieldGroup.push(
                      {
                        key: fc.getAttribute('key'),
                        type: 'select',
                        templateOptions: {
                          label: child1.getAttribute('text'),
                          placeholder: child1.getAttribute('text'),
                          description: child1.getAttribute('description'),
                          required: req,
                          options: opts,
                        },
                      }
                    );
                    this.fields = this.fields.splice(0);
                  }
                }
              }
            }
          }
        }
          this.fields.push(f);
      } else {
        const f: FormlyFieldConfig = {
          key: form.getAttribute('key'),
          wrappers: ['panel'],
          templateOptions: { label: form.parentElement.getAttribute('text') },
          fieldGroup: [],
        };
        for(let i = 0; i<parentchildren.length; i++) {
          if(parentchildren[i].tagName === 'topic') {
            const child = parentchildren[i];
            const fc = child.firstElementChild;

            const req = (/true/i).test(fc.getAttribute('required'));
            if(fc.tagName === "textfield") {
              f.fieldGroup.push(
                {
                  key: fc.getAttribute('key'),
                  type: 'input',
                  templateOptions: {
                    placeholder: child.getAttribute('text'),
                    description: child.getAttribute('description'),
                    label: child.getAttribute('text'),
                    required: req
                  },
                }
              );
            } else if(fc.tagName === "textarea") {
              f.fieldGroup.push(
                {
                  key: fc.getAttribute('key'),
                  type: 'textarea',
                  templateOptions: {
                    placeholder: child.getAttribute('text'),
                    label: child.getAttribute('text'),
                    rows: 10,
                    required: req,
                    description: child.getAttribute('description'),
                  },
                }
              );
              this.fields = this.fields.splice(0);
            } else if(fc.tagName === "radiogroup") {
              const opts = [];
              //for(let z = 0; z < fc.parentElement.children.length -1; z++) {
                  const parChildren = fc.parentElement.children;
                  for(let a = 0; a < parChildren.length; a++) {
                    if(fc.parentElement.children[a].tagName === 'topic') {
                    const ch = parChildren[a];
                    opts.push({ value: ch.getAttribute('key'), label: ch.getAttribute('text')});
                  }
                //}
              }
              f.fieldGroup.push(
                {
                  key: fc.getAttribute('key'),
                  type: 'radio',
                  templateOptions: {
                    label: child.getAttribute('text'),
                    placeholder: child.getAttribute('text'),
                    description: child.getAttribute('description'),
                    required: true,
                    options: opts,
                  },
                }
              );
              this.fields = this.fields.splice(0);
            } else if(fc.tagName === "checkbox") {
              f.fieldGroup.push(
                {
                  key: fc.getAttribute('key'),
                  type: 'checkbox',
                  templateOptions: {
                    label: child.getAttribute('text'),
                    description: child.getAttribute('text'),
                    pattern: 'true',
                    required: req,
                  },
                }
              );
            } else if(fc.tagName === "select") {
              const opts = [];
              //for(let z = 0; z < fc.parentElement.children.length -1; z++) {
                  const parChildren = fc.parentElement.children;
                  for(let a = 0; a < parChildren.length; a++) {
                    if(fc.parentElement.children[a].tagName === 'topic') {
                    const ch = parChildren[a];
                    opts.push({ value: ch.getAttribute('key'), label: ch.getAttribute('text')});
                  }
                //}
              }
              f.fieldGroup.push(
                {
                  key: fc.getAttribute('key'),
                  type: 'select',
                  templateOptions: {
                    label: child.getAttribute('text'),
                    placeholder: child.getAttribute('text'),
                    description: child.getAttribute('description'),
                    required: req,
                    options: opts,
                  },
                }
              );
            }
          }
        }
        this.fields.push(f);
      }
      }
    const obj = this.xml2json.xmlToJson(xml);
    this.json = obj;
    return this.json;
  }

  submit() {
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.userService.query().subscribe(users => {
          this.user = users.body.find(x => x.id === this.account.id);
          this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(res => {
            const fd = res.body;
            if(fd === null) {
              const formdata: FormulaData = new FormulaData();
              formdata.created = dayjs();
              formdata.map = this.model;
              formdata.modified = dayjs();
              formdata.user = this.user;
              this.formulaDataService.create(formdata).subscribe();
            } else {
              fd.map = this.model;
              fd.modified = dayjs();
              this.formulaDataService.update(fd).subscribe();
            }
          });
        });
      }
    });
  }

}
