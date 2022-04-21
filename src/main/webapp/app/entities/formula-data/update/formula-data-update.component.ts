import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFormulaData, FormulaData } from '../formula-data.model';
import { FormulaDataService } from '../service/formula-data.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-formula-data-update',
  templateUrl: './formula-data-update.component.html',
})
export class FormulaDataUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    map: [],
    created: [],
    modified: [],
    user: [],
  });

  constructor(
    protected formulaDataService: FormulaDataService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formulaData }) => {
      if (formulaData.id === undefined) {
        const today = dayjs().startOf('day');
        formulaData.created = today;
        formulaData.modified = today;
      }

      this.updateForm(formulaData);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formulaData = this.createFromForm();
    if (formulaData.id !== undefined) {
      this.subscribeToSaveResponse(this.formulaDataService.update(formulaData));
    } else {
      this.subscribeToSaveResponse(this.formulaDataService.create(formulaData));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormulaData>>): void {
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

  protected updateForm(formulaData: IFormulaData): void {
    this.editForm.patchValue({
      id: formulaData.id,
      map: formulaData.map,
      created: formulaData.created ? formulaData.created.format(DATE_TIME_FORMAT) : null,
      modified: formulaData.modified ? formulaData.modified.format(DATE_TIME_FORMAT) : null,
      user: formulaData.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, formulaData.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IFormulaData {
    return {
      ...new FormulaData(),
      id: this.editForm.get(['id'])!.value,
      map: this.editForm.get(['map'])!.value,
      created: this.editForm.get(['created'])!.value ? dayjs(this.editForm.get(['created'])!.value, DATE_TIME_FORMAT) : undefined,
      modified: this.editForm.get(['modified'])!.value ? dayjs(this.editForm.get(['modified'])!.value, DATE_TIME_FORMAT) : undefined,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
