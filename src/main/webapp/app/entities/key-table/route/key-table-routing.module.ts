import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KeyTableComponent } from '../list/key-table.component';
import { KeyTableDetailComponent } from '../detail/key-table-detail.component';
import { KeyTableUpdateComponent } from '../update/key-table-update.component';
import { KeyTableRoutingResolveService } from './key-table-routing-resolve.service';

const keyTableRoute: Routes = [
  {
    path: '',
    component: KeyTableComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KeyTableDetailComponent,
    resolve: {
      keyTable: KeyTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KeyTableUpdateComponent,
    resolve: {
      keyTable: KeyTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KeyTableUpdateComponent,
    resolve: {
      keyTable: KeyTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(keyTableRoute)],
  exports: [RouterModule],
})
export class KeyTableRoutingModule {}
