import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IMindmap, Mindmap } from '../mindmap.model';
import { MindmapService } from '../service/mindmap.service';

@Component({
  selector: 'jhi-mindmap-update',
  templateUrl: './mindmap-update.component.html',
})
export class MindmapUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    text: [],
    modified: [],
  });

  constructor(protected mindmapService: MindmapService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mindmap }) => {
      if (mindmap.id === undefined) {
        const today = dayjs().startOf('day');
        mindmap.modified = today;
      }

      this.updateForm(mindmap);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mindmap = this.createFromForm();
    if (mindmap.id !== undefined) {
      this.subscribeToSaveResponse(this.mindmapService.update(mindmap));
    } else {
      this.subscribeToSaveResponse(this.mindmapService.create(mindmap));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMindmap>>): void {
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

  protected updateForm(mindmap: IMindmap): void {
    this.editForm.patchValue({
      id: mindmap.id,
      text: mindmap.text,
      modified: mindmap.modified ? mindmap.modified.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IMindmap {
    return {
      ...new Mindmap(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      modified: this.editForm.get(['modified'])!.value ? dayjs(this.editForm.get(['modified'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
