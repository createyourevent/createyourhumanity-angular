import { NgModule } from '@angular/core';

import { FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldDateTimeComponent } from './formly-field-datetime.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      types: [{ name: 'datetime-local', component: FormlyFieldDateTimeComponent, wrappers: ['form-field'] }]
    }),
    FormlyBootstrapModule
  ],
  declarations: [FormlyFieldDateTimeComponent]
})
export class FormlyFieldDateTimeAppModule {}
