import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrantsLevel } from '../grants-level.model';
import { GrantsLevelService } from '../service/grants-level.service';

@Component({
  templateUrl: './grants-level-delete-dialog.component.html',
})
export class GrantsLevelDeleteDialogComponent {
  grantsLevel?: IGrantsLevel;

  constructor(protected grantsLevelService: GrantsLevelService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.grantsLevelService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
