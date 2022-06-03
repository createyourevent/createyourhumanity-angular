import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormulaData, getFormulaDataIdentifier } from '../formula-data.model';

export type EntityResponseType = HttpResponse<IFormulaData>;
export type EntityArrayResponseType = HttpResponse<IFormulaData[]>;

@Injectable({ providedIn: 'root' })
export class FormulaDataService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/formula-data');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(formulaData: IFormulaData): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(formulaData);
    return this.http
      .post<IFormulaData>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(formulaData: IFormulaData): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(formulaData);
    return this.http
      .put<IFormulaData>(`${this.resourceUrl}/${getFormulaDataIdentifier(formulaData) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(formulaData: IFormulaData): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(formulaData);
    return this.http
      .patch<IFormulaData>(`${this.resourceUrl}/${getFormulaDataIdentifier(formulaData) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IFormulaData>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFormulaData[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFormulaDataToCollectionIfMissing(
    formulaDataCollection: IFormulaData[],
    ...formulaDataToCheck: (IFormulaData | null | undefined)[]
  ): IFormulaData[] {
    const formulaData: IFormulaData[] = formulaDataToCheck.filter(isPresent);
    if (formulaData.length > 0) {
      const formulaDataCollectionIdentifiers = formulaDataCollection.map(formulaDataItem => getFormulaDataIdentifier(formulaDataItem)!);
      const formulaDataToAdd = formulaData.filter(formulaDataItem => {
        const formulaDataIdentifier = getFormulaDataIdentifier(formulaDataItem);
        if (formulaDataIdentifier == null || formulaDataCollectionIdentifiers.includes(formulaDataIdentifier)) {
          return false;
        }
        formulaDataCollectionIdentifiers.push(formulaDataIdentifier);
        return true;
      });
      return [...formulaDataToAdd, ...formulaDataCollection];
    }
    return formulaDataCollection;
  }

  convertDateFromClient(formulaData: IFormulaData): IFormulaData {
    return Object.assign({}, formulaData, {
      created: formulaData.created?.isValid() ? formulaData.created.toJSON() : undefined,
      modified: formulaData.modified?.isValid() ? formulaData.modified.toJSON() : undefined,
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
      res.body.forEach((formulaData: IFormulaData) => {
        formulaData.created = formulaData.created ? dayjs(formulaData.created) : undefined;
        formulaData.modified = formulaData.modified ? dayjs(formulaData.modified) : undefined;
      });
    }
    return res;
  }
}
