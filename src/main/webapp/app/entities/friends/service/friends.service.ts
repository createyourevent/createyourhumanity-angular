import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFriends, getFriendsIdentifier } from '../friends.model';

export type EntityResponseType = HttpResponse<IFriends>;
export type EntityArrayResponseType = HttpResponse<IFriends[]>;

@Injectable({ providedIn: 'root' })
export class FriendsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/friends');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(friends: IFriends): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(friends);
    return this.http
      .post<IFriends>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(friends: IFriends): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(friends);
    return this.http
      .put<IFriends>(`${this.resourceUrl}/${getFriendsIdentifier(friends) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(friends: IFriends): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(friends);
    return this.http
      .patch<IFriends>(`${this.resourceUrl}/${getFriendsIdentifier(friends) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IFriends>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFriends[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFriendsToCollectionIfMissing(friendsCollection: IFriends[], ...friendsToCheck: (IFriends | null | undefined)[]): IFriends[] {
    const friends: IFriends[] = friendsToCheck.filter(isPresent);
    if (friends.length > 0) {
      const friendsCollectionIdentifiers = friendsCollection.map(friendsItem => getFriendsIdentifier(friendsItem)!);
      const friendsToAdd = friends.filter(friendsItem => {
        const friendsIdentifier = getFriendsIdentifier(friendsItem);
        if (friendsIdentifier == null || friendsCollectionIdentifiers.includes(friendsIdentifier)) {
          return false;
        }
        friendsCollectionIdentifiers.push(friendsIdentifier);
        return true;
      });
      return [...friendsToAdd, ...friendsCollection];
    }
    return friendsCollection;
  }

  protected convertDateFromClient(friends: IFriends): IFriends {
    return Object.assign({}, friends, {
      connectDate: friends.connectDate?.isValid() ? friends.connectDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.connectDate = res.body.connectDate ? dayjs(res.body.connectDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((friends: IFriends) => {
        friends.connectDate = friends.connectDate ? dayjs(friends.connectDate) : undefined;
      });
    }
    return res;
  }
}
