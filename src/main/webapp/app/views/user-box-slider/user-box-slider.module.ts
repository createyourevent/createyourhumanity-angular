import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBoxSliderComponent } from './user-box-slider.component';
import { SharedModule } from 'app/shared/shared.module';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CarouselModule,
    ButtonModule,
    DataViewModule,
    DropdownModule,
    InputTextModule,
    CardModule
  ],
  declarations: [UserBoxSliderComponent],
  exports: [UserBoxSliderComponent]
})
export class UserBoxSliderModule { }
