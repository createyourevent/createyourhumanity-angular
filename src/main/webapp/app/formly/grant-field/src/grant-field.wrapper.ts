import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit, AfterContentChecked, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
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

interface GroupItem {
  name: string,
  id: string
}

@Component({
  selector: 'formly-wrapper-grant-field',
  styleUrls: ['./grant-field.wrapper.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="border">
    <ng-container #fieldComponent></ng-container>
    <hr/>
    <div class="grant-select">
      <label for="grant-select" class="grant-title">{{ 'grants.grant' | translate }}</label>
      <select id="grant-select" matNativeControl (change)="changeGrant($event)">
        <option *ngFor="let option of grantItems" [value]="option.id"
                [selected]="selectedGrantItem === option.id">{{ option.name }}</option>
      </select>
      <ng-container *ngIf="groupVisible">
      <label for="group-select" class="group-title">{{ 'grants.group' | translate }}</label>
      <select matNativeControl (change)="changeGroup($event)">
        <option [selected]="selectedGroupItem === 'All'" value="ALLFRIENDS">All</option>
        <option *ngFor="let option of groupItems" [value]="option.id"
                 [selected]="selectedGroupItem === option.id">{{ option.name }}</option>
      </select>
      </ng-container>
    </div>
  </div>
  `,
})
export class FormlyWrapperGrantField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> implements OnInit {

  grantItems: GrantItem[];

  selectedGrantItem: string;

  grantFormGroup: FormGroup;

  groupItems: GroupItem[] = [];

  selectedGroupItem: string;

  groupFormGroup: FormGroup;

  account: Account | null;

  groupVisible = false;

  user: IUser;

  //@Output() _changeGroup = new EventEmitter();

  constructor(private translateService: TranslateService,
              private maincontrollerService: MaincontrollerService,
              private formulaDataService: FormulaDataService,
              private accountService: AccountService,
              private ref: ChangeDetectorRef)
  {
    super();
  }

  ngOnInit(): void {
    this.grantItems = [
      { name: this.translateService.instant('grant-field.none'), id: GrantEnum.None },
      { name: this.translateService.instant('grant-field.friends'), id: GrantEnum.Friends },
      { name: this.translateService.instant('grant-field.all'), id: GrantEnum.All }
    ];
    this.groupItems = [];
    const map1 = new Map(Object.entries(this.field.grant));
    this.selectedGrantItem = map1.get(this.field.key + '') as string ? map1.get(this.field.key + '') as string : GrantEnum.All;
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.maincontrollerService.findAuthenticatedUser().subscribe(u => {
        this.user = u.body;
        this.maincontrollerService.findGroupsByOwnerId(this.user.id).subscribe(g => {
          const groups = g.body;
          groups.forEach(el => {
            this.groupItems.push({name: el.name, id: el.id});
          });
          if(this.selectedGrantItem === 'FRIENDS') {
            this.groupVisible = true;
            const map2 = new Map(Object.entries(this.field.group));
            this.selectedGroupItem = map2.get(this.field.key + '') as string ? map2.get(this.field.key + '') as string : 'ALLGROUPS';
          }
          this.groupItems = this.groupItems.splice(0);
          this.ref.markForCheck();
        });
      });
    });
  }

  getGroupVisible(grant): boolean {
    if(grant === 'FRIENDS') {
      return this.groupVisible = true;
    }
    return this.groupVisible = false;
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
      this.grantItems = this.grantItems.splice(0);
      this.getGroupVisible(s);
      this.ref.markForCheck();
    });
  }

  changeGroup(e: any) {
    //this.field.options.groupChanges.next(true);
    const s =  (event.target as HTMLSelectElement).value;
    this.maincontrollerService.findFormulaDataByUserId(this.user.id).subscribe(res => {
      const fd = res.body;
      let a = new Map<string, string>(Object.entries(JSON.parse(fd.group)));
      a = a.set(this.field.key + '', s);
      fd.group = JSON.stringify(Object.fromEntries(a));
      fd.user = this.user;
      this.formulaDataService.update(fd).subscribe(() => {
        this.groupItems = this.groupItems.splice(0);
        //this._changeGroup.emit(e.value);
        this.ref.markForCheck();
      });
    });
  }
}
