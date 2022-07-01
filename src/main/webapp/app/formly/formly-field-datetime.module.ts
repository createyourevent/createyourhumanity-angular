import { NgModule } from '@angular/core';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldDateTimeComponent } from './formly-field-datetime.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FormlyModule.forRoot({
      types: [{ name: 'datetime-local', component: FormlyFieldDateTimeComponent, wrappers: ['form-field'] }]
    }),
    FormlyBootstrapModule
  ],
  declarations: [FormlyFieldDateTimeComponent]
})
export class FormlyFieldDateTimeAppModule {}
