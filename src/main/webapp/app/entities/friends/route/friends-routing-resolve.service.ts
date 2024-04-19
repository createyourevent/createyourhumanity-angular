import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFriends, Friends } from '../friends.model';
import { FriendsService } from '../service/friends.service';

@Injectable({ providedIn: 'root' })
export class FriendsRoutingResolveService  {
  constructor(protected service: FriendsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFriends> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((friends: HttpResponse<Friends>) => {
          if (friends.body) {
            return of(friends.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Friends());
  }
}
