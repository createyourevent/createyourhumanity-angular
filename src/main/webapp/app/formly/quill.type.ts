import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'formly-field-custom-input',
  template: `
    <quill-editor [formControl]="formControl" [formlyAttributes]="field">
    </quill-editor>
  `,
})
export class FieldQuillTypeComponent extends FieldType {
  private _formControl: FormControl;

  constructor() {
    super();
    this._formControl = new FormControl('', {});
  }

  get formControl(): FormControl {
    return this._formControl;
  }
}
