import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit, AfterContentChecked } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { assignGrantFieldValue, FieldWrapper, FormlyFieldConfig, FormlyFieldProps} from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import { IUser } from 'app/entities/user/user.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import dayjs from 'dayjs';
import { GrantEnum } from './grant-enum';

interface GrantItem {
  name: string,
  id: string
}

@Component({
  selector: 'formly-wrapper-grant-field',
  styleUrls: ['./grant-field.wrapper.scss'],
  template: `
  <div class="border">
    <ng-container #fieldComponent></ng-container>
    <hr/>
    <div class="grant-select">
      <label for="grant-select" class="grant-title">{{ 'grants.grant' | translate }}</label>
      <select matNativeControl (change)="changeGrant($event)">
        <option *ngFor="let option of grantItems" [value]="option.id"
                [selected]="selectedGrantItem === option.id">{{ option.name }}</option>
      </select>
    </div>
  </div>
  `,
})
export class FormlyWrapperGrantField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> implements OnInit {

  grantItems: GrantItem[];

  selectedGrantItem: string;

  grantFormGroup: FormGroup;

  account: Account | null;

  user: IUser;

  constructor(private translateService: TranslateService,
              private maincontrollerService: MaincontrollerService,
              private formulaDataService: FormulaDataService,
              private accountService: AccountService)
  {
    super();
  }
  ngOnInit(): void {
    this.grantItems = [
      { name: this.translateService.instant('grant-field.none'), id: GrantEnum.None },
      { name: this.translateService.instant('grant-field.friends'), id: GrantEnum.Friends },
      { name: this.translateService.instant('grant-field.all'), id: GrantEnum.All }
    ];
    const map1 = new Map(Object.entries(this.field.grant));
    this.selectedGrantItem = map1.get(this.field.key + '') as string ? map1.get(this.field.key + '') as string : GrantEnum.All;
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.maincontrollerService.findAuthenticatedUser().subscribe(u => {
        this.user = u.body;
      });
    });
  }

  changeGrant(e: any) {
    const s =  (event.target as HTMLSelectElement).value;
    this.maincontrollerService.findFormulaDataByUserId(this.user.id).subscribe(res => {
      const fd = res.body;
      let a = new Map<string, string>(Object.entries(JSON.parse(fd.grant)));
      a = a.set(this.field.key + '', s);
      fd.grant = JSON.stringify(Object.fromEntries(a));
      fd.user = this.user;
      this.formulaDataService.update(fd).subscribe();
    });
  }
}
