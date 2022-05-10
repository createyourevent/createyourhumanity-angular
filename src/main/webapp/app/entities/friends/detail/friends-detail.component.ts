import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFriends } from '../friends.model';

@Component({
  selector: 'jhi-friends-detail',
  templateUrl: './friends-detail.component.html',
})
export class FriendsDetailComponent implements OnInit {
  friends: IFriends | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ friends }) => {
      this.friends = friends;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
