import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVisibilityStatus, VisibilityStatus } from '../visibility-status.model';
import { VisibilityStatusService } from '../service/visibility-status.service';

@Injectable({ providedIn: 'root' })
export class VisibilityStatusRoutingResolveService implements Resolve<IVisibilityStatus> {
  constructor(protected service: VisibilityStatusService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVisibilityStatus> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((visibilityStatus: HttpResponse<VisibilityStatus>) => {
          if (visibilityStatus.body) {
            return of(visibilityStatus.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new VisibilityStatus());
  }
}
