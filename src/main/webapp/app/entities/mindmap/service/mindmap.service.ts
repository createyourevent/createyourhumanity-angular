import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMindmap, getMindmapIdentifier } from '../mindmap.model';

export type EntityResponseType = HttpResponse<IMindmap>;
export type EntityArrayResponseType = HttpResponse<IMindmap[]>;

@Injectable({ providedIn: 'root' })
export class MindmapService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mindmaps');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mindmap: IMindmap): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mindmap);
    return this.http
      .post<IMindmap>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(mindmap: IMindmap): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mindmap);
    return this.http
      .put<IMindmap>(`${this.resourceUrl}/${getMindmapIdentifier(mindmap) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(mindmap: IMindmap): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mindmap);
    return this.http
      .patch<IMindmap>(`${this.resourceUrl}/${getMindmapIdentifier(mindmap) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IMindmap>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMindmap[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMindmapToCollectionIfMissing(mindmapCollection: IMindmap[], ...mindmapsToCheck: (IMindmap | null | undefined)[]): IMindmap[] {
    const mindmaps: IMindmap[] = mindmapsToCheck.filter(isPresent);
    if (mindmaps.length > 0) {
      const mindmapCollectionIdentifiers = mindmapCollection.map(mindmapItem => getMindmapIdentifier(mindmapItem)!);
      const mindmapsToAdd = mindmaps.filter(mindmapItem => {
        const mindmapIdentifier = getMindmapIdentifier(mindmapItem);
        if (mindmapIdentifier == null || mindmapCollectionIdentifiers.includes(mindmapIdentifier)) {
          return false;
        }
        mindmapCollectionIdentifiers.push(mindmapIdentifier);
        return true;
      });
      return [...mindmapsToAdd, ...mindmapCollection];
    }
    return mindmapCollection;
  }

  protected convertDateFromClient(mindmap: IMindmap): IMindmap {
    return Object.assign({}, mindmap, {
      modified: mindmap.modified?.isValid() ? mindmap.modified.toJSON() : undefined,
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
      res.body.forEach((mindmap: IMindmap) => {
        mindmap.modified = mindmap.modified ? dayjs(mindmap.modified) : undefined;
      });
    }
    return res;
  }
}
