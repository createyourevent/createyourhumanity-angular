import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserMindmap } from '../user-mindmap.model';
import { UserMindmapService } from '../service/user-mindmap.service';
import { UserMindmapDeleteDialogComponent } from '../delete/user-mindmap-delete-dialog.component';

@Component({
  selector: 'jhi-user-mindmap',
  templateUrl: './user-mindmap.component.html',
})
export class UserMindmapComponent implements OnInit {
  userMindmaps?: IUserMindmap[];
  isLoading = false;

  constructor(protected userMindmapService: UserMindmapService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userMindmapService.query().subscribe({
      next: (res: HttpResponse<IUserMindmap[]>) => {
        this.isLoading = false;
        this.userMindmaps = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUserMindmap): string {
    return item.id!;
  }

  delete(userMindmap: IUserMindmap): void {
    const modalRef = this.modalService.open(UserMindmapDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userMindmap = userMindmap;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
