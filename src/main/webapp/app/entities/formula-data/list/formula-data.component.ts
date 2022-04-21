import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormulaData } from '../formula-data.model';
import { FormulaDataService } from '../service/formula-data.service';
import { FormulaDataDeleteDialogComponent } from '../delete/formula-data-delete-dialog.component';

@Component({
  selector: 'jhi-formula-data',
  templateUrl: './formula-data.component.html',
})
export class FormulaDataComponent implements OnInit {
  formulaData?: IFormulaData[];
  isLoading = false;

  constructor(protected formulaDataService: FormulaDataService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.formulaDataService.query().subscribe({
      next: (res: HttpResponse<IFormulaData[]>) => {
        this.isLoading = false;
        this.formulaData = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFormulaData): string {
    return item.id!;
  }

  delete(formulaData: IFormulaData): void {
    const modalRef = this.modalService.open(FormulaDataDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formulaData = formulaData;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
