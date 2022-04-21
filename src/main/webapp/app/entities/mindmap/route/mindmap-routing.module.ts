import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MindmapComponent } from '../list/mindmap.component';
import { MindmapDetailComponent } from '../detail/mindmap-detail.component';
import { MindmapUpdateComponent } from '../update/mindmap-update.component';
import { MindmapRoutingResolveService } from './mindmap-routing-resolve.service';

const mindmapRoute: Routes = [
  {
    path: '',
    component: MindmapComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MindmapDetailComponent,
    resolve: {
      mindmap: MindmapRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MindmapUpdateComponent,
    resolve: {
      mindmap: MindmapRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MindmapUpdateComponent,
    resolve: {
      mindmap: MindmapRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mindmapRoute)],
  exports: [RouterModule],
})
export class MindmapRoutingModule {}
