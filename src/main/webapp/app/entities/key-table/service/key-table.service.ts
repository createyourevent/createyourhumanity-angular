import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKeyTable, getKeyTableIdentifier } from '../key-table.model';

export type EntityResponseType = HttpResponse<IKeyTable>;
export type EntityArrayResponseType = HttpResponse<IKeyTable[]>;

@Injectable({ providedIn: 'root' })
export class KeyTableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/key-tables');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(keyTable: IKeyTable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(keyTable);
    return this.http
      .post<IKeyTable>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(keyTable: IKeyTable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(keyTable);
    return this.http
      .put<IKeyTable>(`${this.resourceUrl}/${getKeyTableIdentifier(keyTable) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(keyTable: IKeyTable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(keyTable);
    return this.http
      .patch<IKeyTable>(`${this.resourceUrl}/${getKeyTableIdentifier(keyTable) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IKeyTable>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IKeyTable[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addKeyTableToCollectionIfMissing(keyTableCollection: IKeyTable[], ...keyTablesToCheck: (IKeyTable | null | undefined)[]): IKeyTable[] {
    const keyTables: IKeyTable[] = keyTablesToCheck.filter(isPresent);
    if (keyTables.length > 0) {
      const keyTableCollectionIdentifiers = keyTableCollection.map(keyTableItem => getKeyTableIdentifier(keyTableItem)!);
      const keyTablesToAdd = keyTables.filter(keyTableItem => {
        const keyTableIdentifier = getKeyTableIdentifier(keyTableItem);
        if (keyTableIdentifier == null || keyTableCollectionIdentifiers.includes(keyTableIdentifier)) {
          return false;
        }
        keyTableCollectionIdentifiers.push(keyTableIdentifier);
        return true;
      });
      return [...keyTablesToAdd, ...keyTableCollection];
    }
    return keyTableCollection;
  }

  convertDateFromClient(keyTable: IKeyTable): IKeyTable {
    return Object.assign({}, keyTable, {
      created: keyTable.created?.isValid() ? keyTable.created.toJSON() : undefined,
      modified: keyTable.modified?.isValid() ? keyTable.modified.toJSON() : undefined,
    });
  }

  convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.modified = res.body.modified ? dayjs(res.body.modified) : undefined;
    }
    return res;
  }

  convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((keyTable: IKeyTable) => {
        keyTable.created = keyTable.created ? dayjs(keyTable.created) : undefined;
        keyTable.modified = keyTable.modified ? dayjs(keyTable.modified) : undefined;
      });
    }
    return res;
  }
}
