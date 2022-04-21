import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFormulaData } from '../formula-data.model';

@Component({
  selector: 'jhi-formula-data-detail',
  templateUrl: './formula-data-detail.component.html',
})
export class FormulaDataDetailComponent implements OnInit {
  formulaData: IFormulaData | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formulaData }) => {
      this.formulaData = formulaData;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
