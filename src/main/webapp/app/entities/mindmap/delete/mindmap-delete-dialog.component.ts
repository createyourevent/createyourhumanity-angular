import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMindmap } from '../mindmap.model';
import { MindmapService } from '../service/mindmap.service';

@Component({
  templateUrl: './mindmap-delete-dialog.component.html',
})
export class MindmapDeleteDialogComponent {
  mindmap?: IMindmap;

  constructor(protected mindmapService: MindmapService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.mindmapService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
