import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKeyTable } from '../key-table.model';
import { KeyTableService } from '../service/key-table.service';

@Component({
  templateUrl: './key-table-delete-dialog.component.html',
})
export class KeyTableDeleteDialogComponent {
  keyTable?: IKeyTable;

  constructor(protected keyTableService: KeyTableService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.keyTableService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
