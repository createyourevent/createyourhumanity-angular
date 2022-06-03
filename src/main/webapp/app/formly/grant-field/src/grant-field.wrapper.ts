import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { assignGrantFieldValue, FieldWrapper, FormlyFieldConfig, FormlyFieldProps} from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { GrantEnum } from './grant-enum';

interface GrantItem {
  name: string,
  id: string
}

@Component({
  selector: 'formly-wrapper-grant-field',
  styleUrls: ['./grant-field.wrapper.scss'],
  template: `
  <ng-container #fieldComponent></ng-container>
  <div class="grant-select">
    <label for="grant-select" class="grant-title">Grant</label>
    <ng-select [items]="grantItems"
      bindLabel="name"
      bindValue="id"
      (change)="changeGrant($event)"
      [(ngModel)]="selectedGrantItem">
    </ng-select>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormlyWrapperGrantField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> implements OnInit, AfterViewInit {

  grantItems: GrantItem[];

  selectedGrantItem: string;

  grantFormGroup: FormGroup;

  constructor(private cd: ChangeDetectorRef,
              private config: NgSelectConfig,
              private translateService: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.grantItems = [
      { name: this.translateService.instant('grant-field.none'), id: GrantEnum.None },
      { name: this.translateService.instant('grant-field.friends'), id: GrantEnum.Friends },
      { name: this.translateService.instant('grant-field.all'), id: GrantEnum.All }
    ];
  }

  ngAfterViewInit(): void {
    this.options.grantChangesSubject.subscribe(s => {
      const x = s[this.field.key + ''];
      const y = this.grantItems.find(gi => gi.id === x);
      this.selectedGrantItem = y.id;
    });
    if(!this.selectedGrantItem) {
      this.selectedGrantItem = GrantEnum.All;
    }
  }

  changeGrant(e: any) {
    assignGrantFieldValue(this.field, e.id);
    this.options.grantChanges.next(e.id);
  }

  getGrant() {
    const k = this.field.key + '';
    if(this.field && this.field.grant) {
      return this.field.grant[k];
    }
  }
}
