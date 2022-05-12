import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFriends, Friends } from '../friends.model';
import { FriendsService } from '../service/friends.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-friends-update',
  templateUrl: './friends-update.component.html',
})
export class FriendsUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    connectDate: [],
    friendId: [],
    user: [],
  });

  constructor(
    protected friendsService: FriendsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ friends }) => {
      if (friends.id === undefined) {
        const today = dayjs().startOf('day');
        friends.connectDate = today;
      }

      this.updateForm(friends);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const friends = this.createFromForm();
    if (friends.id !== undefined) {
      this.subscribeToSaveResponse(this.friendsService.update(friends));
    } else {
      this.subscribeToSaveResponse(this.friendsService.create(friends));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFriends>>): void {
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

  protected updateForm(friends: IFriends): void {
    this.editForm.patchValue({
      id: friends.id,
      connectDate: friends.connectDate ? friends.connectDate.format(DATE_TIME_FORMAT) : null,
      friendId: friends.friendId,
      user: friends.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, friends.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IFriends {
    return {
      ...new Friends(),
      id: this.editForm.get(['id'])!.value,
      connectDate: this.editForm.get(['connectDate'])!.value
        ? dayjs(this.editForm.get(['connectDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      friendId: this.editForm.get(['friendId'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
