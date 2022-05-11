import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFriendrequest, Friendrequest } from '../friendrequest.model';
import { FriendrequestService } from '../service/friendrequest.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-friendrequest-update',
  templateUrl: './friendrequest-update.component.html',
})
export class FriendrequestUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    requestDate: [],
    requestUserId: [],
    info: [],
    user: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected friendrequestService: FriendrequestService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ friendrequest }) => {
      if (friendrequest.id === undefined) {
        const today = dayjs().startOf('day');
        friendrequest.requestDate = today;
      }

      this.updateForm(friendrequest);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('createyourhumanityAngularApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const friendrequest = this.createFromForm();
    if (friendrequest.id !== undefined) {
      this.subscribeToSaveResponse(this.friendrequestService.update(friendrequest));
    } else {
      this.subscribeToSaveResponse(this.friendrequestService.create(friendrequest));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFriendrequest>>): void {
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

  protected updateForm(friendrequest: IFriendrequest): void {
    this.editForm.patchValue({
      id: friendrequest.id,
      requestDate: friendrequest.requestDate ? friendrequest.requestDate.format(DATE_TIME_FORMAT) : null,
      requestUserId: friendrequest.requestUserId,
      info: friendrequest.info,
      user: friendrequest.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, friendrequest.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IFriendrequest {
    return {
      ...new Friendrequest(),
      id: this.editForm.get(['id'])!.value,
      requestDate: this.editForm.get(['requestDate'])!.value
        ? dayjs(this.editForm.get(['requestDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      requestUserId: this.editForm.get(['requestUserId'])!.value,
      info: this.editForm.get(['info'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
