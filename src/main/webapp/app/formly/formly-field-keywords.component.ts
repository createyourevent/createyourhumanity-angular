import { Component } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-field-keywords',
  templateUrl: './formly-field-keywords.component.html'
})
export class FormlyFieldKeywordsComponent extends FieldType {
  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    return ctrl;
  }
}
