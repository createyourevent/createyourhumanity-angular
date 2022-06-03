import { Component } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-field-keywords-list',
  templateUrl: './formly-field-keywords-list.component.html'
})
export class FormlyFieldKeywordsListComponent extends FieldType {

  convertToList(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    console.log(ctrl)
    return ctrl;
  }


}
