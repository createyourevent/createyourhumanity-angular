import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrantsLevel } from '../grants-level.model';

@Component({
  selector: 'jhi-grants-level-detail',
  templateUrl: './grants-level-detail.component.html',
})
export class GrantsLevelDetailComponent implements OnInit {
  grantsLevel: IGrantsLevel | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grantsLevel }) => {
      this.grantsLevel = grantsLevel;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
