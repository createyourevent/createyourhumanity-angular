import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVisibilityStatus } from '../visibility-status.model';
import { VisibilityStatusService } from '../service/visibility-status.service';

@Component({
  templateUrl: './visibility-status-delete-dialog.component.html',
})
export class VisibilityStatusDeleteDialogComponent {
  visibilityStatus?: IVisibilityStatus;

  constructor(protected visibilityStatusService: VisibilityStatusService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.visibilityStatusService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
