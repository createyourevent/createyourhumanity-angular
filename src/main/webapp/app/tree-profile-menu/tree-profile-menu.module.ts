import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeProfileMenuComponent } from './tree-profile-menu.component';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    ContextMenuModule,
    ToastModule,
    ButtonModule,
    DialogModule
  ],
  declarations: [TreeProfileMenuComponent],
  exports: [TreeProfileMenuComponent]
})
export class TreeProfileMenuModule { }
