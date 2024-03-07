import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrantsLevel, getGrantsLevelIdentifier } from '../grants-level.model';

export type EntityResponseType = HttpResponse<IGrantsLevel>;
export type EntityArrayResponseType = HttpResponse<IGrantsLevel[]>;

@Injectable({ providedIn: 'root' })
export class GrantsLevelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grants-levels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grantsLevel: IGrantsLevel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grantsLevel);
    return this.http
      .post<IGrantsLevel>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(grantsLevel: IGrantsLevel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grantsLevel);
    return this.http
      .put<IGrantsLevel>(`${this.resourceUrl}/${getGrantsLevelIdentifier(grantsLevel) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(grantsLevel: IGrantsLevel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grantsLevel);
    return this.http
      .patch<IGrantsLevel>(`${this.resourceUrl}/${getGrantsLevelIdentifier(grantsLevel) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IGrantsLevel>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IGrantsLevel[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGrantsLevelToCollectionIfMissing(
    grantsLevelCollection: IGrantsLevel[],
    ...grantsLevelsToCheck: (IGrantsLevel | null | undefined)[]
  ): IGrantsLevel[] {
    const grantsLevels: IGrantsLevel[] = grantsLevelsToCheck.filter(isPresent);
    if (grantsLevels.length > 0) {
      const grantsLevelCollectionIdentifiers = grantsLevelCollection.map(grantsLevelItem => getGrantsLevelIdentifier(grantsLevelItem)!);
      const grantsLevelsToAdd = grantsLevels.filter(grantsLevelItem => {
        const grantsLevelIdentifier = getGrantsLevelIdentifier(grantsLevelItem);
        if (grantsLevelIdentifier == null || grantsLevelCollectionIdentifiers.includes(grantsLevelIdentifier)) {
          return false;
        }
        grantsLevelCollectionIdentifiers.push(grantsLevelIdentifier);
        return true;
      });
      return [...grantsLevelsToAdd, ...grantsLevelCollection];
    }
    return grantsLevelCollection;
  }

  protected convertDateFromClient(grantsLevel: IGrantsLevel): IGrantsLevel {
    return Object.assign({}, grantsLevel, {
      created: grantsLevel.created?.isValid() ? grantsLevel.created.toJSON() : undefined,
      modified: grantsLevel.modified?.isValid() ? grantsLevel.modified.toJSON() : undefined,
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
      res.body.forEach((grantsLevel: IGrantsLevel) => {
        grantsLevel.created = grantsLevel.created ? dayjs(grantsLevel.created) : undefined;
        grantsLevel.modified = grantsLevel.modified ? dayjs(grantsLevel.modified) : undefined;
      });
    }
    return res;
  }
}
