import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVisibilityStatus } from '../visibility-status.model';

@Component({
  selector: 'jhi-visibility-status-detail',
  templateUrl: './visibility-status-detail.component.html',
})
export class VisibilityStatusDetailComponent implements OnInit {
  visibilityStatus: IVisibilityStatus | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ visibilityStatus }) => {
      this.visibilityStatus = visibilityStatus;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
