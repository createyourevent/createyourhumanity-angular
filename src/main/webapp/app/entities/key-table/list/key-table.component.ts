import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IKeyTable } from '../key-table.model';
import { KeyTableService } from '../service/key-table.service';
import { KeyTableDeleteDialogComponent } from '../delete/key-table-delete-dialog.component';

@Component({
  selector: 'jhi-key-table',
  templateUrl: './key-table.component.html',
})
export class KeyTableComponent implements OnInit {
  keyTables?: IKeyTable[];
  isLoading = false;

  constructor(protected keyTableService: KeyTableService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.keyTableService.query().subscribe({
      next: (res: HttpResponse<IKeyTable[]>) => {
        this.isLoading = false;
        this.keyTables = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IKeyTable): string {
    return item.id!;
  }

  delete(keyTable: IKeyTable): void {
    const modalRef = this.modalService.open(KeyTableDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.keyTable = keyTable;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
