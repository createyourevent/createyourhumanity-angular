import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMindmap } from '../mindmap.model';
import { MindmapService } from '../service/mindmap.service';
import { MindmapDeleteDialogComponent } from '../delete/mindmap-delete-dialog.component';

@Component({
  selector: 'jhi-mindmap',
  templateUrl: './mindmap.component.html',
})
export class MindmapComponent implements OnInit {
  mindmaps?: IMindmap[];
  isLoading = false;

  constructor(protected mindmapService: MindmapService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.mindmapService.query().subscribe({
      next: (res: HttpResponse<IMindmap[]>) => {
        this.isLoading = false;
        this.mindmaps = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMindmap): string {
    return item.id!;
  }

  delete(mindmap: IMindmap): void {
    const modalRef = this.modalService.open(MindmapDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.mindmap = mindmap;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
