import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserMindmap, UserMindmap } from '../user-mindmap.model';
import { UserMindmapService } from '../service/user-mindmap.service';

@Injectable({ providedIn: 'root' })
export class UserMindmapRoutingResolveService  {
  constructor(protected service: UserMindmapService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserMindmap> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userMindmap: HttpResponse<UserMindmap>) => {
          if (userMindmap.body) {
            return of(userMindmap.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserMindmap());
  }
}
