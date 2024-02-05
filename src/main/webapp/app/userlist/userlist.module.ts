import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserlistComponent } from './userlist.component';
import { ButtonModule } from 'primeng';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'app/shared/shared.module';
import { UserlistRoutes } from './userlist.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DataViewModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    UserlistRoutes
  ],
  declarations: [UserlistComponent]
})
export class UserlistModule { }
