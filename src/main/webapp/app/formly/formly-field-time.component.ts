import { Component } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
 selector: 'jhi-formly-field-time',
 templateUrl: './formly-field-time.component.html',
})
export class FormlyFieldTimeComponent extends FieldType {
  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    return ctrl;
  }
}
