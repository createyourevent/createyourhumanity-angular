import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructionsComponent } from './instructions.component';
import { InstructionsRoutes } from './instructions.routing';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InstructionsRoutes
  ],
  declarations: [InstructionsComponent]
})
export class InstructionsModule { }
