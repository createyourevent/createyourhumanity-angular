import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrantsLevel } from '../grants-level.model';
import { GrantsLevelService } from '../service/grants-level.service';
import { GrantsLevelDeleteDialogComponent } from '../delete/grants-level-delete-dialog.component';

@Component({
  selector: 'jhi-grants-level',
  templateUrl: './grants-level.component.html',
})
export class GrantsLevelComponent implements OnInit {
  grantsLevels?: IGrantsLevel[];
  isLoading = false;

  constructor(protected grantsLevelService: GrantsLevelService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.grantsLevelService.query().subscribe({
      next: (res: HttpResponse<IGrantsLevel[]>) => {
        this.isLoading = false;
        this.grantsLevels = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IGrantsLevel): string {
    return item.id!;
  }

  delete(grantsLevel: IGrantsLevel): void {
    const modalRef = this.modalService.open(GrantsLevelDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.grantsLevel = grantsLevel;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
