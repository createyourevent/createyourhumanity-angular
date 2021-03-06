import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendlistComponent } from './friendlist.component';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FriendlistRoutes } from './friendlist.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DataViewModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    FriendlistRoutes
  ],
  declarations: [FriendlistComponent]
})
export class FriendlistModule { }
