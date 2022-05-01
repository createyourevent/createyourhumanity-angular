import { Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-row',
  template: `
    <div *ngFor="let step of field.fieldGroup; let index = index; let last = last;">
      <formly-field [field]="step"></formly-field>
    </div>
`,
})
export class RowComponent extends FieldType {
}
