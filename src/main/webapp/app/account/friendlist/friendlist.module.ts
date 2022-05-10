import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendlistComponent } from './friendlist.component';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DataViewModule
  ],
  declarations: [FriendlistComponent]
})
export class FriendlistModule { }
