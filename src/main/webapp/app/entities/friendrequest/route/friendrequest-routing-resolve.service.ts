import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFriendrequest, Friendrequest } from '../friendrequest.model';
import { FriendrequestService } from '../service/friendrequest.service';

@Injectable({ providedIn: 'root' })
export class FriendrequestRoutingResolveService implements Resolve<IFriendrequest> {
  constructor(protected service: FriendrequestService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFriendrequest> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((friendrequest: HttpResponse<Friendrequest>) => {
          if (friendrequest.body) {
            return of(friendrequest.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Friendrequest());
  }
}
