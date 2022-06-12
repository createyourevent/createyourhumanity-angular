import { Component } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-field-datetime',
  templateUrl: './formly-field-datetime.component.html'
})
export class FormlyFieldDateTimeComponent extends FieldType {

  constructor() {
    super();
  }

  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    return ctrl;
  }
}
