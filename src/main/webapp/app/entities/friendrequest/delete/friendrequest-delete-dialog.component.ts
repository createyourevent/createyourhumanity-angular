import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFriendrequest } from '../friendrequest.model';
import { FriendrequestService } from '../service/friendrequest.service';

@Component({
  templateUrl: './friendrequest-delete-dialog.component.html',
})
export class FriendrequestDeleteDialogComponent {
  friendrequest?: IFriendrequest;

  constructor(protected friendrequestService: FriendrequestService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.friendrequestService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
