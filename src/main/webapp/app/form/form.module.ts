import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { SharedModule } from 'app/shared/shared.module';
import { FormRoutes } from './form.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormRoutes
  ],
  declarations: [FormComponent]
})
export class FormModule { }
