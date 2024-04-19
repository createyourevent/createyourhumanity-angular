import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKeyTable, KeyTable } from '../key-table.model';
import { KeyTableService } from '../service/key-table.service';

@Injectable({ providedIn: 'root' })
export class KeyTableRoutingResolveService  {
  constructor(protected service: KeyTableService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKeyTable> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((keyTable: HttpResponse<KeyTable>) => {
          if (keyTable.body) {
            return of(keyTable.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new KeyTable());
  }
}
