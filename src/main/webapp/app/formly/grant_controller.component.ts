import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { Grants } from 'app/core/enums/grants';
import { FormControl } from '@angular/forms';
import { GrantsLevel } from 'app/entities/grants-level/grants-level.model';
import { UserService } from '../user.service';

@Component({
  template:`
  <div class="form-field-box">
<div class="form-field-content">
  <ng-container #fieldComponent></ng-container>
</div>
</div>
<hr/>
<div class="form-field-label">Viewing permissions:</div>
    <select [(ngModel)]='selected' class="grants" #select (change)="selectOption(select.value)" [ngModel]="selected">
      <option *ngFor="let grant of grants" [value]="grant" [selected]="selected === selected">
        {{ grant }}
      </option>
    </select>
  `,
})
export class FormlyGrantsComponent extends FieldWrapper implements OnInit {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;

  grants: string[];
  selected: string;

  constructor(userService: UserService) {
    super();
  }

  ngOnInit() {
    this.grants = Object.values(Grants);
    this.selected = this.grants[0];
  }

  selectOption(id: string) {

    this.selected = id;

  }

}
