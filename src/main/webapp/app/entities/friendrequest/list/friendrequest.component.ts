import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFriendrequest } from '../friendrequest.model';
import { FriendrequestService } from '../service/friendrequest.service';
import { FriendrequestDeleteDialogComponent } from '../delete/friendrequest-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-friendrequest',
  templateUrl: './friendrequest.component.html',
})
export class FriendrequestComponent implements OnInit {
  friendrequests?: IFriendrequest[];
  isLoading = false;

  constructor(protected friendrequestService: FriendrequestService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.friendrequestService.query().subscribe({
      next: (res: HttpResponse<IFriendrequest[]>) => {
        this.isLoading = false;
        this.friendrequests = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFriendrequest): string {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(friendrequest: IFriendrequest): void {
    const modalRef = this.modalService.open(FriendrequestDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.friendrequest = friendrequest;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
