import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFormulaData, FormulaData } from '../formula-data.model';
import { FormulaDataService } from '../service/formula-data.service';

@Injectable({ providedIn: 'root' })
export class FormulaDataRoutingResolveService  {
  constructor(protected service: FormulaDataService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFormulaData> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((formulaData: HttpResponse<FormulaData>) => {
          if (formulaData.body) {
            return of(formulaData.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FormulaData());
  }
}
