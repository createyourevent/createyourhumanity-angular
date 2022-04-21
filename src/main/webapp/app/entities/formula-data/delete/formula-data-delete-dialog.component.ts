import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormulaData } from '../formula-data.model';
import { FormulaDataService } from '../service/formula-data.service';

@Component({
  templateUrl: './formula-data-delete-dialog.component.html',
})
export class FormulaDataDeleteDialogComponent {
  formulaData?: IFormulaData;

  constructor(protected formulaDataService: FormulaDataService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.formulaDataService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
