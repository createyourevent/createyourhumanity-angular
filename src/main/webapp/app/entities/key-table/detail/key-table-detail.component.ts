import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKeyTable } from '../key-table.model';

@Component({
  selector: 'jhi-key-table-detail',
  templateUrl: './key-table-detail.component.html',
})
export class KeyTableDetailComponent implements OnInit {
  keyTable: IKeyTable | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ keyTable }) => {
      this.keyTable = keyTable;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
