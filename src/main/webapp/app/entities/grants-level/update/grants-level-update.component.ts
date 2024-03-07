import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IGrantsLevel, GrantsLevel } from '../grants-level.model';
import { GrantsLevelService } from '../service/grants-level.service';

@Component({
  selector: 'jhi-grants-level-update',
  templateUrl: './grants-level-update.component.html',
})
export class GrantsLevelUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    map: [],
    created: [],
    modified: [],
  });

  constructor(protected grantsLevelService: GrantsLevelService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grantsLevel }) => {
      if (grantsLevel.id === undefined) {
        const today = dayjs().startOf('day');
        grantsLevel.created = today;
        grantsLevel.modified = today;
      }

      this.updateForm(grantsLevel);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grantsLevel = this.createFromForm();
    if (grantsLevel.id !== undefined) {
      this.subscribeToSaveResponse(this.grantsLevelService.update(grantsLevel));
    } else {
      this.subscribeToSaveResponse(this.grantsLevelService.create(grantsLevel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrantsLevel>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(grantsLevel: IGrantsLevel): void {
    this.editForm.patchValue({
      id: grantsLevel.id,
      map: grantsLevel.map,
      created: grantsLevel.created ? grantsLevel.created.format(DATE_TIME_FORMAT) : null,
      modified: grantsLevel.modified ? grantsLevel.modified.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IGrantsLevel {
    return {
      ...new GrantsLevel(),
      id: this.editForm.get(['id'])!.value,
      map: this.editForm.get(['map'])!.value,
      created: this.editForm.get(['created'])!.value ? dayjs(this.editForm.get(['created'])!.value, DATE_TIME_FORMAT) : undefined,
      modified: this.editForm.get(['modified'])!.value ? dayjs(this.editForm.get(['modified'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
