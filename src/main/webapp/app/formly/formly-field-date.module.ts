import { NgModule } from '@angular/core';

import { FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldDateComponent } from './formly-field-date.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      types: [{ name: 'date', component: FormlyFieldDateComponent, wrappers: ['form-field'] }]
    }),
    FormlyBootstrapModule
  ],
  declarations: [FormlyFieldDateComponent]
})
export class FormlyFieldDateTimeAppModule {}
