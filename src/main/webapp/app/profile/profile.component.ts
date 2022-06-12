import { FormComponent } from './../form/form.component';
import { FormulaData, IFormulaData } from './../entities/formula-data/formula-data.model';
import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { Component, Input, AfterViewInit, ViewChildren, QueryList, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { Account } from 'app/core/auth/account.model';
import { ProfileHostDirective } from './profile-host.directive';
import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';


interface Item {
  id: string,
  header: string
}
@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit{

  items: Item[] = [];
  components: any[] = []
  mindmap: Mindmap;
  formulaData: FormulaData;
  forms: any[] = [];
  pages: any;
  xml: any;
  user: IUser;

  @ViewChildren(ProfileHostDirective) profileHosts: QueryList<ProfileHostDirective>;
  @Input() userId: string;
  @Input() mapId: string;

  account: Account | null = null;

  constructor(private accountService: AccountService,
              private maincontrollerService: MaincontrollerService,
              private mindmapService: MindmapService,
              private formulaDataService: FormulaDataService) { }

  ngOnInit() {
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
          this.maincontrollerService.findAuthenticatedUserWithFormulaData().subscribe(u => {
            this.user = u.body;
          });
          this.checkFormulaDataFromUser(this.account);
          this.mindmapService.query().subscribe(umm => {
            const mindmaps = umm.body;
            this.mindmap = mindmaps[0];
            this.maincontrollerService.findFormulaDataByUserId(this.userId).subscribe(res => {
              this.formulaData = res.body;
              const parser = new DOMParser();
              const xml = parser.parseFromString(this.mindmap.text, 'text/xml');
              this.pages = xml.querySelectorAll('[id="form"]');

              let index = 0;
              this.pages.forEach(page => {
                this.forms.push(page.parentElement);
                this.items.push({id: `${index}`, header: page.parentElement.getAttribute('text')});
                index++;
              });
            });
          });
        }
      })
  }

  ngAfterViewInit(): any {
    this.profileHosts.changes.subscribe(ph => {
      let index = 0;
      ph.forEach(p => {
        const component: typeof FormComponent = FormComponent;
        const r = p.viewContainerRef.createComponent(component);
        r.instance.xml = this.forms[index].outerHTML;
        r.instance.userId = this.userId;
        r.instance.mapId = this.mindmap.id;
        index++;
      });
    });
  }

  private checkFormulaDataFromUser(account: Account): void {
    this.maincontrollerService.findFormulaDataByUserId(account.id).subscribe(fd => {
      if(!fd.body) {
        this.maincontrollerService.findAuthenticatedUser().subscribe(u => {
          const user = u.body;
          const formulaData: IFormulaData = new FormulaData();
          formulaData.map = '{}';
          formulaData.grant = '{}';
          formulaData.created = dayjs();
          formulaData.modified = dayjs();
          formulaData.user = user;
          this.formulaDataService.create(formulaData).subscribe();
        });
      }
    });
  }
}

