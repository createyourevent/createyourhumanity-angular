import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserMindmap } from '../user-mindmap.model';

@Component({
  selector: 'jhi-user-mindmap-detail',
  templateUrl: './user-mindmap-detail.component.html',
})
export class UserMindmapDetailComponent implements OnInit {
  userMindmap: IUserMindmap | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userMindmap }) => {
      this.userMindmap = userMindmap;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
