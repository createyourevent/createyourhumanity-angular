import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VisibilityStatusComponent } from '../list/visibility-status.component';
import { VisibilityStatusDetailComponent } from '../detail/visibility-status-detail.component';
import { VisibilityStatusUpdateComponent } from '../update/visibility-status-update.component';
import { VisibilityStatusRoutingResolveService } from './visibility-status-routing-resolve.service';

const visibilityStatusRoute: Routes = [
  {
    path: '',
    component: VisibilityStatusComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VisibilityStatusDetailComponent,
    resolve: {
      visibilityStatus: VisibilityStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VisibilityStatusUpdateComponent,
    resolve: {
      visibilityStatus: VisibilityStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VisibilityStatusUpdateComponent,
    resolve: {
      visibilityStatus: VisibilityStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(visibilityStatusRoute)],
  exports: [RouterModule],
})
export class VisibilityStatusRoutingModule {}
