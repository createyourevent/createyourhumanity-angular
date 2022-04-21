import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMindmap } from '../mindmap.model';

@Component({
  selector: 'jhi-mindmap-detail',
  templateUrl: './mindmap-detail.component.html',
})
export class MindmapDetailComponent implements OnInit {
  mindmap: IMindmap | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mindmap }) => {
      this.mindmap = mindmap;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
