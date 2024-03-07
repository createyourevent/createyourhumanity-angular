import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVisibilityStatus } from '../visibility-status.model';
import { VisibilityStatusService } from '../service/visibility-status.service';
import { VisibilityStatusDeleteDialogComponent } from '../delete/visibility-status-delete-dialog.component';

@Component({
  selector: 'jhi-visibility-status',
  templateUrl: './visibility-status.component.html',
})
export class VisibilityStatusComponent implements OnInit {
  visibilityStatuses?: IVisibilityStatus[];
  isLoading = false;

  constructor(protected visibilityStatusService: VisibilityStatusService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.visibilityStatusService.query().subscribe({
      next: (res: HttpResponse<IVisibilityStatus[]>) => {
        this.isLoading = false;
        this.visibilityStatuses = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVisibilityStatus): string {
    return item.id!;
  }

  delete(visibilityStatus: IVisibilityStatus): void {
    const modalRef = this.modalService.open(VisibilityStatusDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.visibilityStatus = visibilityStatus;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
