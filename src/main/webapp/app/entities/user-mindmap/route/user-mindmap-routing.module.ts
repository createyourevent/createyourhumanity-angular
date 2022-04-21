import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserMindmapComponent } from '../list/user-mindmap.component';
import { UserMindmapDetailComponent } from '../detail/user-mindmap-detail.component';
import { UserMindmapUpdateComponent } from '../update/user-mindmap-update.component';
import { UserMindmapRoutingResolveService } from './user-mindmap-routing-resolve.service';

const userMindmapRoute: Routes = [
  {
    path: '',
    component: UserMindmapComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserMindmapDetailComponent,
    resolve: {
      userMindmap: UserMindmapRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserMindmapUpdateComponent,
    resolve: {
      userMindmap: UserMindmapRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserMindmapUpdateComponent,
    resolve: {
      userMindmap: UserMindmapRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userMindmapRoute)],
  exports: [RouterModule],
})
export class UserMindmapRoutingModule {}
