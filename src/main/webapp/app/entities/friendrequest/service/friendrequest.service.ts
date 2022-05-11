import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFriendrequest, getFriendrequestIdentifier } from '../friendrequest.model';

export type EntityResponseType = HttpResponse<IFriendrequest>;
export type EntityArrayResponseType = HttpResponse<IFriendrequest[]>;

@Injectable({ providedIn: 'root' })
export class FriendrequestService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/friendrequests');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(friendrequest: IFriendrequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(friendrequest);
    return this.http
      .post<IFriendrequest>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(friendrequest: IFriendrequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(friendrequest);
    return this.http
      .put<IFriendrequest>(`${this.resourceUrl}/${getFriendrequestIdentifier(friendrequest) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(friendrequest: IFriendrequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(friendrequest);
    return this.http
      .patch<IFriendrequest>(`${this.resourceUrl}/${getFriendrequestIdentifier(friendrequest) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IFriendrequest>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFriendrequest[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFriendrequestToCollectionIfMissing(
    friendrequestCollection: IFriendrequest[],
    ...friendrequestsToCheck: (IFriendrequest | null | undefined)[]
  ): IFriendrequest[] {
    const friendrequests: IFriendrequest[] = friendrequestsToCheck.filter(isPresent);
    if (friendrequests.length > 0) {
      const friendrequestCollectionIdentifiers = friendrequestCollection.map(
        friendrequestItem => getFriendrequestIdentifier(friendrequestItem)!
      );
      const friendrequestsToAdd = friendrequests.filter(friendrequestItem => {
        const friendrequestIdentifier = getFriendrequestIdentifier(friendrequestItem);
        if (friendrequestIdentifier == null || friendrequestCollectionIdentifiers.includes(friendrequestIdentifier)) {
          return false;
        }
        friendrequestCollectionIdentifiers.push(friendrequestIdentifier);
        return true;
      });
      return [...friendrequestsToAdd, ...friendrequestCollection];
    }
    return friendrequestCollection;
  }

  protected convertDateFromClient(friendrequest: IFriendrequest): IFriendrequest {
    return Object.assign({}, friendrequest, {
      requestDate: friendrequest.requestDate?.isValid() ? friendrequest.requestDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.requestDate = res.body.requestDate ? dayjs(res.body.requestDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((friendrequest: IFriendrequest) => {
        friendrequest.requestDate = friendrequest.requestDate ? dayjs(friendrequest.requestDate) : undefined;
      });
    }
    return res;
  }
}
