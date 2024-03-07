import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVisibilityStatus, getVisibilityStatusIdentifier } from '../visibility-status.model';

export type EntityResponseType = HttpResponse<IVisibilityStatus>;
export type EntityArrayResponseType = HttpResponse<IVisibilityStatus[]>;

@Injectable({ providedIn: 'root' })
export class VisibilityStatusService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/visibility-statuses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(visibilityStatus: IVisibilityStatus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(visibilityStatus);
    return this.http
      .post<IVisibilityStatus>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(visibilityStatus: IVisibilityStatus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(visibilityStatus);
    return this.http
      .put<IVisibilityStatus>(`${this.resourceUrl}/${getVisibilityStatusIdentifier(visibilityStatus) as string}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(visibilityStatus: IVisibilityStatus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(visibilityStatus);
    return this.http
      .patch<IVisibilityStatus>(`${this.resourceUrl}/${getVisibilityStatusIdentifier(visibilityStatus) as string}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IVisibilityStatus>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IVisibilityStatus[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVisibilityStatusToCollectionIfMissing(
    visibilityStatusCollection: IVisibilityStatus[],
    ...visibilityStatusesToCheck: (IVisibilityStatus | null | undefined)[]
  ): IVisibilityStatus[] {
    const visibilityStatuses: IVisibilityStatus[] = visibilityStatusesToCheck.filter(isPresent);
    if (visibilityStatuses.length > 0) {
      const visibilityStatusCollectionIdentifiers = visibilityStatusCollection.map(
        visibilityStatusItem => getVisibilityStatusIdentifier(visibilityStatusItem)!
      );
      const visibilityStatusesToAdd = visibilityStatuses.filter(visibilityStatusItem => {
        const visibilityStatusIdentifier = getVisibilityStatusIdentifier(visibilityStatusItem);
        if (visibilityStatusIdentifier == null || visibilityStatusCollectionIdentifiers.includes(visibilityStatusIdentifier)) {
          return false;
        }
        visibilityStatusCollectionIdentifiers.push(visibilityStatusIdentifier);
        return true;
      });
      return [...visibilityStatusesToAdd, ...visibilityStatusCollection];
    }
    return visibilityStatusCollection;
  }

  protected convertDateFromClient(visibilityStatus: IVisibilityStatus): IVisibilityStatus {
    return Object.assign({}, visibilityStatus, {
      created: visibilityStatus.created?.isValid() ? visibilityStatus.created.toJSON() : undefined,
      modified: visibilityStatus.modified?.isValid() ? visibilityStatus.modified.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.modified = res.body.modified ? dayjs(res.body.modified) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((visibilityStatus: IVisibilityStatus) => {
        visibilityStatus.created = visibilityStatus.created ? dayjs(visibilityStatus.created) : undefined;
        visibilityStatus.modified = visibilityStatus.modified ? dayjs(visibilityStatus.modified) : undefined;
      });
    }
    return res;
  }
}
