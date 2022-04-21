import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserMindmap, getUserMindmapIdentifier } from '../user-mindmap.model';

export type EntityResponseType = HttpResponse<IUserMindmap>;
export type EntityArrayResponseType = HttpResponse<IUserMindmap[]>;

@Injectable({ providedIn: 'root' })
export class UserMindmapService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-mindmaps');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userMindmap: IUserMindmap): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userMindmap);
    return this.http
      .post<IUserMindmap>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(userMindmap: IUserMindmap): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userMindmap);
    return this.http
      .put<IUserMindmap>(`${this.resourceUrl}/${getUserMindmapIdentifier(userMindmap) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(userMindmap: IUserMindmap): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userMindmap);
    return this.http
      .patch<IUserMindmap>(`${this.resourceUrl}/${getUserMindmapIdentifier(userMindmap) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IUserMindmap>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUserMindmap[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserMindmapToCollectionIfMissing(
    userMindmapCollection: IUserMindmap[],
    ...userMindmapsToCheck: (IUserMindmap | null | undefined)[]
  ): IUserMindmap[] {
    const userMindmaps: IUserMindmap[] = userMindmapsToCheck.filter(isPresent);
    if (userMindmaps.length > 0) {
      const userMindmapCollectionIdentifiers = userMindmapCollection.map(userMindmapItem => getUserMindmapIdentifier(userMindmapItem)!);
      const userMindmapsToAdd = userMindmaps.filter(userMindmapItem => {
        const userMindmapIdentifier = getUserMindmapIdentifier(userMindmapItem);
        if (userMindmapIdentifier == null || userMindmapCollectionIdentifiers.includes(userMindmapIdentifier)) {
          return false;
        }
        userMindmapCollectionIdentifiers.push(userMindmapIdentifier);
        return true;
      });
      return [...userMindmapsToAdd, ...userMindmapCollection];
    }
    return userMindmapCollection;
  }

  protected convertDateFromClient(userMindmap: IUserMindmap): IUserMindmap {
    return Object.assign({}, userMindmap, {
      modified: userMindmap.modified?.isValid() ? userMindmap.modified.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.modified = res.body.modified ? dayjs(res.body.modified) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((userMindmap: IUserMindmap) => {
        userMindmap.modified = userMindmap.modified ? dayjs(userMindmap.modified) : undefined;
      });
    }
    return res;
  }
}
