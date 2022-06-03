import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserlistComponent } from './userlist.component';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'app/shared/shared.module';
import { UserlistRoutes } from './userlist.routing';
import { CardModule } from 'primeng/card';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DataViewModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    UserlistRoutes,
    CardModule
  ],
  declarations: [UserlistComponent]
})
export class UserlistModule { }
