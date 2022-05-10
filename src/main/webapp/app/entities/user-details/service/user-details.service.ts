import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserDetails, getUserDetailsIdentifier } from '../user-details.model';

export type EntityResponseType = HttpResponse<IUserDetails>;
export type EntityArrayResponseType = HttpResponse<IUserDetails[]>;

@Injectable({ providedIn: 'root' })
export class UserDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userDetails: IUserDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userDetails);
    return this.http
      .post<IUserDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(userDetails: IUserDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userDetails);
    return this.http
      .put<IUserDetails>(`${this.resourceUrl}/${getUserDetailsIdentifier(userDetails) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(userDetails: IUserDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userDetails);
    return this.http
      .patch<IUserDetails>(`${this.resourceUrl}/${getUserDetailsIdentifier(userDetails) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IUserDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUserDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserDetailsToCollectionIfMissing(
    userDetailsCollection: IUserDetails[],
    ...userDetailsToCheck: (IUserDetails | null | undefined)[]
  ): IUserDetails[] {
    const userDetails: IUserDetails[] = userDetailsToCheck.filter(isPresent);
    if (userDetails.length > 0) {
      const userDetailsCollectionIdentifiers = userDetailsCollection.map(userDetailsItem => getUserDetailsIdentifier(userDetailsItem)!);
      const userDetailsToAdd = userDetails.filter(userDetailsItem => {
        const userDetailsIdentifier = getUserDetailsIdentifier(userDetailsItem);
        if (userDetailsIdentifier == null || userDetailsCollectionIdentifiers.includes(userDetailsIdentifier)) {
          return false;
        }
        userDetailsCollectionIdentifiers.push(userDetailsIdentifier);
        return true;
      });
      return [...userDetailsToAdd, ...userDetailsCollection];
    }
    return userDetailsCollection;
  }

  protected convertDateFromClient(userDetails: IUserDetails): IUserDetails {
    return Object.assign({}, userDetails, {
      dob: userDetails.dob?.isValid() ? userDetails.dob.toJSON() : undefined,
      created: userDetails.created?.isValid() ? userDetails.created.toJSON() : undefined,
      modified: userDetails.modified?.isValid() ? userDetails.modified.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dob = res.body.dob ? dayjs(res.body.dob) : undefined;
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.modified = res.body.modified ? dayjs(res.body.modified) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((userDetails: IUserDetails) => {
        userDetails.dob = userDetails.dob ? dayjs(userDetails.dob) : undefined;
        userDetails.created = userDetails.created ? dayjs(userDetails.created) : undefined;
        userDetails.modified = userDetails.modified ? dayjs(userDetails.modified) : undefined;
      });
    }
    return res;
  }
}
