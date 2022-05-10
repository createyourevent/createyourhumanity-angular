import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFriends } from '../friends.model';
import { FriendsService } from '../service/friends.service';
import { FriendsDeleteDialogComponent } from '../delete/friends-delete-dialog.component';

@Component({
  selector: 'jhi-friends',
  templateUrl: './friends.component.html',
})
export class FriendsComponent implements OnInit {
  friends?: IFriends[];
  isLoading = false;

  constructor(protected friendsService: FriendsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.friendsService.query().subscribe({
      next: (res: HttpResponse<IFriends[]>) => {
        this.isLoading = false;
        this.friends = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFriends): string {
    return item.id!;
  }

  delete(friends: IFriends): void {
    const modalRef = this.modalService.open(FriendsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.friends = friends;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
