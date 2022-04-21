import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IUserMindmap, UserMindmap } from '../user-mindmap.model';
import { UserMindmapService } from '../service/user-mindmap.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-user-mindmap-update',
  templateUrl: './user-mindmap-update.component.html',
})
export class UserMindmapUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    text: [],
    modified: [],
    user: [],
  });

  constructor(
    protected userMindmapService: UserMindmapService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userMindmap }) => {
      if (userMindmap.id === undefined) {
        const today = dayjs().startOf('day');
        userMindmap.modified = today;
      }

      this.updateForm(userMindmap);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userMindmap = this.createFromForm();
    if (userMindmap.id !== undefined) {
      this.subscribeToSaveResponse(this.userMindmapService.update(userMindmap));
    } else {
      this.subscribeToSaveResponse(this.userMindmapService.create(userMindmap));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserMindmap>>): void {
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

  protected updateForm(userMindmap: IUserMindmap): void {
    this.editForm.patchValue({
      id: userMindmap.id,
      text: userMindmap.text,
      modified: userMindmap.modified ? userMindmap.modified.format(DATE_TIME_FORMAT) : null,
      user: userMindmap.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, userMindmap.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IUserMindmap {
    return {
      ...new UserMindmap(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      modified: this.editForm.get(['modified'])!.value ? dayjs(this.editForm.get(['modified'])!.value, DATE_TIME_FORMAT) : undefined,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
