
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-input',
  template: `
      <input
        type="datetime-local"
        [formControl]="formControl"
        class="form-control"
        [formlyAttributes]="field"
        [class.is-invalid]="showError"
      />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeInputComponent extends FieldType<FieldTypeConfig> {
}
