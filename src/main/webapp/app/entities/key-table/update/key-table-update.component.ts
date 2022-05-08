import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IKeyTable, KeyTable } from '../key-table.model';
import { KeyTableService } from '../service/key-table.service';

@Component({
  selector: 'jhi-key-table-update',
  templateUrl: './key-table-update.component.html',
})
export class KeyTableUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    key: [],
    created: [],
    modified: [],
  });

  constructor(protected keyTableService: KeyTableService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ keyTable }) => {
      if (keyTable.id === undefined) {
        const today = dayjs().startOf('day');
        keyTable.created = today;
        keyTable.modified = today;
      }

      this.updateForm(keyTable);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const keyTable = this.createFromForm();
    if (keyTable.id !== undefined) {
      this.subscribeToSaveResponse(this.keyTableService.update(keyTable));
    } else {
      this.subscribeToSaveResponse(this.keyTableService.create(keyTable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKeyTable>>): void {
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

  protected updateForm(keyTable: IKeyTable): void {
    this.editForm.patchValue({
      id: keyTable.id,
      key: keyTable.key,
      created: keyTable.created ? keyTable.created.format(DATE_TIME_FORMAT) : null,
      modified: keyTable.modified ? keyTable.modified.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IKeyTable {
    return {
      ...new KeyTable(),
      id: this.editForm.get(['id'])!.value,
      key: this.editForm.get(['key'])!.value,
      created: this.editForm.get(['created'])!.value ? dayjs(this.editForm.get(['created'])!.value, DATE_TIME_FORMAT) : undefined,
      modified: this.editForm.get(['modified'])!.value ? dayjs(this.editForm.get(['modified'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
