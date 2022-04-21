import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserMindmap } from '../user-mindmap.model';
import { UserMindmapService } from '../service/user-mindmap.service';

@Component({
  templateUrl: './user-mindmap-delete-dialog.component.html',
})
export class UserMindmapDeleteDialogComponent {
  userMindmap?: IUserMindmap;

  constructor(protected userMindmapService: UserMindmapService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.userMindmapService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
