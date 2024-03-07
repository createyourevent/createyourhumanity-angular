import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IVisibilityStatus, VisibilityStatus } from '../visibility-status.model';
import { VisibilityStatusService } from '../service/visibility-status.service';

@Component({
  selector: 'jhi-visibility-status-update',
  templateUrl: './visibility-status-update.component.html',
})
export class VisibilityStatusUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    map: [],
    created: [],
    modified: [],
  });

  constructor(
    protected visibilityStatusService: VisibilityStatusService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ visibilityStatus }) => {
      if (visibilityStatus.id === undefined) {
        const today = dayjs().startOf('day');
        visibilityStatus.created = today;
        visibilityStatus.modified = today;
      }

      this.updateForm(visibilityStatus);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const visibilityStatus = this.createFromForm();
    if (visibilityStatus.id !== undefined) {
      this.subscribeToSaveResponse(this.visibilityStatusService.update(visibilityStatus));
    } else {
      this.subscribeToSaveResponse(this.visibilityStatusService.create(visibilityStatus));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVisibilityStatus>>): void {
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

  protected updateForm(visibilityStatus: IVisibilityStatus): void {
    this.editForm.patchValue({
      id: visibilityStatus.id,
      map: visibilityStatus.map,
      created: visibilityStatus.created ? visibilityStatus.created.format(DATE_TIME_FORMAT) : null,
      modified: visibilityStatus.modified ? visibilityStatus.modified.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IVisibilityStatus {
    return {
      ...new VisibilityStatus(),
      id: this.editForm.get(['id'])!.value,
      map: this.editForm.get(['map'])!.value,
      created: this.editForm.get(['created'])!.value ? dayjs(this.editForm.get(['created'])!.value, DATE_TIME_FORMAT) : undefined,
      modified: this.editForm.get(['modified'])!.value ? dayjs(this.editForm.get(['modified'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
