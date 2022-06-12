import { Component } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-field-ratings',
  templateUrl: './formly-field-ratings.component.html',
  styleUrls: ['./formly-field-ratings.scss'],
})
export class FormlyFieldRatingsComponent extends FieldType {

  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    return ctrl;
  }
}
