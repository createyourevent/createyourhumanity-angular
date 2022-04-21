import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FormulaDataComponent } from './list/formula-data.component';
import { FormulaDataDetailComponent } from './detail/formula-data-detail.component';
import { FormulaDataUpdateComponent } from './update/formula-data-update.component';
import { FormulaDataDeleteDialogComponent } from './delete/formula-data-delete-dialog.component';
import { FormulaDataRoutingModule } from './route/formula-data-routing.module';

@NgModule({
  imports: [SharedModule, FormulaDataRoutingModule],
  declarations: [FormulaDataComponent, FormulaDataDetailComponent, FormulaDataUpdateComponent, FormulaDataDeleteDialogComponent],
  entryComponents: [FormulaDataDeleteDialogComponent],
})
export class FormulaDataModule {}
