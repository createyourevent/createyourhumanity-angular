import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMindmap, Mindmap } from '../mindmap.model';
import { MindmapService } from '../service/mindmap.service';

@Injectable({ providedIn: 'root' })
export class MindmapRoutingResolveService implements Resolve<IMindmap> {
  constructor(protected service: MindmapService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMindmap> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mindmap: HttpResponse<Mindmap>) => {
          if (mindmap.body) {
            return of(mindmap.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Mindmap());
  }
}
