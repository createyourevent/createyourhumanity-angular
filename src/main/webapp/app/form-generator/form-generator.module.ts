import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGeneratorComponent } from './form-generator.component';
import { FormGeneratorRoutes } from './form-generator.routing';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormGeneratorRoutes,
  ],
  declarations: [FormGeneratorComponent]
})
export class FormGeneratorModule { }
