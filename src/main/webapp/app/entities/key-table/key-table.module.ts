import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KeyTableComponent } from './list/key-table.component';
import { KeyTableDetailComponent } from './detail/key-table-detail.component';
import { KeyTableUpdateComponent } from './update/key-table-update.component';
import { KeyTableDeleteDialogComponent } from './delete/key-table-delete-dialog.component';
import { KeyTableRoutingModule } from './route/key-table-routing.module';

@NgModule({
  imports: [SharedModule, KeyTableRoutingModule],
  declarations: [KeyTableComponent, KeyTableDetailComponent, KeyTableUpdateComponent, KeyTableDeleteDialogComponent],
})
export class KeyTableModule {}
