import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendrequestsComponent } from './friendrequests.component';
import { SharedModule } from 'app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FriendrequestsRoutes } from './friendrequests.routing';
import { CardModule } from 'primeng/card';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DataViewModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    FriendrequestsRoutes,
    CardModule
  ],
  declarations: [FriendrequestsComponent]
})
export class FriendrequestsModule { }
