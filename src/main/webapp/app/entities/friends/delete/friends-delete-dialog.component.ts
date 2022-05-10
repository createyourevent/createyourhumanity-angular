import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFriends } from '../friends.model';
import { FriendsService } from '../service/friends.service';

@Component({
  templateUrl: './friends-delete-dialog.component.html',
})
export class FriendsDeleteDialogComponent {
  friends?: IFriends;

  constructor(protected friendsService: FriendsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.friendsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
