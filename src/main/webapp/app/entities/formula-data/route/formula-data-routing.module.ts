import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FormulaDataComponent } from '../list/formula-data.component';
import { FormulaDataDetailComponent } from '../detail/formula-data-detail.component';
import { FormulaDataUpdateComponent } from '../update/formula-data-update.component';
import { FormulaDataRoutingResolveService } from './formula-data-routing-resolve.service';

const formulaDataRoute: Routes = [
  {
    path: '',
    component: FormulaDataComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormulaDataDetailComponent,
    resolve: {
      formulaData: FormulaDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormulaDataUpdateComponent,
    resolve: {
      formulaData: FormulaDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormulaDataUpdateComponent,
    resolve: {
      formulaData: FormulaDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formulaDataRoute)],
  exports: [RouterModule],
})
export class FormulaDataRoutingModule {}
