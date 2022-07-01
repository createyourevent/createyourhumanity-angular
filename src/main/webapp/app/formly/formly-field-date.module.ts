import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldDateComponent } from './formly-field-date.component';

@NgModule({
  imports: [
    SharedModule,
    FormlyModule.forRoot({
      types: [{ name: 'date', component: FormlyFieldDateComponent, wrappers: ['form-field'] }]
    }),
    FormlyBootstrapModule
  ],
  declarations: [FormlyFieldDateComponent]
})
export class FormlyFieldDateTimeAppModule {}
