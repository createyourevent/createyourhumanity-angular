import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GrantsLevelComponent } from '../list/grants-level.component';
import { GrantsLevelDetailComponent } from '../detail/grants-level-detail.component';
import { GrantsLevelUpdateComponent } from '../update/grants-level-update.component';
import { GrantsLevelRoutingResolveService } from './grants-level-routing-resolve.service';

const grantsLevelRoute: Routes = [
  {
    path: '',
    component: GrantsLevelComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GrantsLevelDetailComponent,
    resolve: {
      grantsLevel: GrantsLevelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GrantsLevelUpdateComponent,
    resolve: {
      grantsLevel: GrantsLevelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GrantsLevelUpdateComponent,
    resolve: {
      grantsLevel: GrantsLevelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(grantsLevelRoute)],
  exports: [RouterModule],
})
export class GrantsLevelRoutingModule {}
