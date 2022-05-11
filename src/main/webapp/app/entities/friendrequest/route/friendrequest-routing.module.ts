import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FriendrequestComponent } from '../list/friendrequest.component';
import { FriendrequestDetailComponent } from '../detail/friendrequest-detail.component';
import { FriendrequestUpdateComponent } from '../update/friendrequest-update.component';
import { FriendrequestRoutingResolveService } from './friendrequest-routing-resolve.service';

const friendrequestRoute: Routes = [
  {
    path: '',
    component: FriendrequestComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FriendrequestDetailComponent,
    resolve: {
      friendrequest: FriendrequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FriendrequestUpdateComponent,
    resolve: {
      friendrequest: FriendrequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FriendrequestUpdateComponent,
    resolve: {
      friendrequest: FriendrequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(friendrequestRoute)],
  exports: [RouterModule],
})
export class FriendrequestRoutingModule {}
