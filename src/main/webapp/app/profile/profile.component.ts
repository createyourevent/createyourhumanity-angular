import { FormulaData } from './../entities/formula-data/formula-data.model';
import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { FormService } from './../form/form.service';
import { Component, Input, AfterViewInit, ViewChildren, QueryList, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { UserService } from 'app/entities/user/user.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { Account } from 'app/core/auth/account.model';
import { ProfileHostDirective } from './profile-host.directive';


interface Item {
  id: string,
  header: string
}
@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit  {

  items: Item[] = [];
  components: any[] = []
  mindmap: Mindmap;
  formulaData: FormulaData;
  forms: any[] = [];
  pages: any;

  @ViewChildren(ProfileHostDirective) profileHosts: QueryList<ProfileHostDirective>;
  @Input() userId: string;
  @Input() mapId: string;

  account: Account | null = null;

  constructor(private formService: FormService,
              private accountService: AccountService,
              private formulaDataService: FormulaDataService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,
              private mindmapService: MindmapService) { }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
          this.mindmapService.query().subscribe(umm => {
            const mindmaps = umm.body;
            this.mindmap = mindmaps[0];
            this.maincontrollerService.findFormulaDataByUserId(this.userId).subscribe(res => {
              this.formulaData = res.body;
              const parser = new DOMParser();
              const xml = parser.parseFromString(this.mindmap.text, 'text/xml');
              this.pages = xml.querySelectorAll('[id="form"]');

              let id = 0;
              this.pages.forEach(page => {
                id++;
                const o = {id: `${id}`, header: page.parentElement.getAttribute('text') };
                this.items.push(o);
              });
              this.items = this.items.splice(0);
            });
          });
        }
      })

  }

  ngAfterViewInit(): void {
    this.convert();
  }


  convert() {
    this.profileHosts.changes.subscribe(res => {
      this.pages.forEach(page => {
        this.forms.push(page.parentElement);
      });
      const pha = res.toArray();
      for(let i = 0; i < this.items.length; i++) {
        this.formService.loadComponent(pha[i].viewContainerRef, this.forms[i].innerHTML, this.account.id, this.mindmap.id, `${i}`).then(res => {
          const af = res;
          this.components.push(af);
        });
      }
    });
  }
}
