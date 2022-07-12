import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-field-tabs',
  template: `
  <mat-tab-group #matTabGroup>
    <mat-tab [class]="tab.templateOptions.className" *ngFor="let tab of field.fieldGroup; let i = index; let last = last;"
      [label]="tab.templateOptions.label">
      <formly-field [field]="tab"></formly-field>
    </mat-tab>
  </mat-tab-group>
`,
})
export class FormlyFieldTabsComponent extends FieldType implements AfterViewInit {

  @ViewChild('matTabGroup') matTabGroup: MatTabGroup;

  index: number;

  constructor() {
    super();
  }
  ngAfterViewInit(): void {
    if(Number(this.field.selectedIndex) >= 0) {
      this.index = Number(this.field.selectedIndex);
      this.focusTab(this.index);
    }
  }

  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup
      ? field.fieldGroup.every((f) => this.isValid(f))
      : true;
  }

  focusTab(id: number) {
    this.matTabGroup.animationDone.subscribe(() => {
      this.matTabGroup.selectedIndex = id;
      this.matTabGroup.focusTab(id);
    });
  }
}
