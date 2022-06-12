import { Component } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-field-multiselect',
  templateUrl: './formly-field-multiselect.component.html'
})
export class FormlyFieldMultiselectComponent extends FieldType {
  formattedaddress = '';

  getOptions(opts): any[] {
    const o: any[] = [];
    opts.forEach(el => {
      o.push(el);
    })
    return o;
  }

  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    return ctrl;
  }
}
