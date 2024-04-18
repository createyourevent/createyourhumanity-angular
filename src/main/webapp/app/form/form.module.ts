import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FormControl} from "@angular/forms";
import { FormComponent } from './form.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FormlyBootstrapModule
  ],
  declarations: [
    FormComponent
  ],
})
export class FormModule {}
