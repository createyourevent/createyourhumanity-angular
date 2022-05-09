
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-input',
  template: `
  <input
    type="date"
      [formControl]="formControl"
    class="form-control"
    [formlyAttributes]="field"
    [class.is-invalid]="showError"
  />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent extends FieldType<FieldTypeConfig> {
}
