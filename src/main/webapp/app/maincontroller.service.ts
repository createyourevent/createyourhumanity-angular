import { IUser } from 'app/entities/user/user.model';
import { IFormulaData } from './entities/formula-data/formula-data.model';
import { IUserMindmap } from './entities/user-mindmap/user-mindmap.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApplicationConfigService } from './core/config/application-config.service';
import dayjs from 'dayjs/esm';
import { KeyTableService } from './entities/key-table/service/key-table.service';
import { IFriends } from './entities/friends/friends.model';
import { IFriendrequest } from './entities/friendrequest/friendrequest.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaincontrollerService {

  public resourceUrl_user_mindmaps = this.applicationConfigService.getEndpointFor('api/user-mindmaps');
  public resourceUrl_formula_datas = this.applicationConfigService.getEndpointFor('api/formula-data');
  public resourceUrl_key_tables = this.applicationConfigService.getEndpointFor('api/key-tables');
  public resourceUrl_friends = this.applicationConfigService.getEndpointFor('api/friends');
  public resourceUrl_friendrequests = this.applicationConfigService.getEndpointFor('api/friendrequests');

  public resourceUrl = this.applicationConfigService.getEndpointFor('authenticatedUser');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService, private keyTableService: KeyTableService) { }

  getGrantFromUser(userId: string, key: string): Observable<string>{
    const options = {
      responseType: 'text' as const,
    };
    const res = this.http.get(`${this.resourceUrl_formula_datas}/${userId}/${key}/getGrant`, options)
              .pipe(map((response: string) => response));
    return res;
  }

  findFriendrequestByRequestedUserIdAndUser(friendId: string, userId: string): Observable<HttpResponse<IFriendrequest[]>> {
    return this.http
    .get<IFriendrequest[]>(`${this.resourceUrl_friendrequests}/${friendId}/${userId}/findByFriendIdAndUserId`, { observe: 'response' });
  }

  findFriendsByFriendIdAndUser(friendId: string, userId: string): Observable<HttpResponse<IFriends[]>> {
    const x = this.http
    .get<IFriends[]>(`${this.resourceUrl_friends}/${friendId}/${userId}/findByFriendIdAndUserId`, { observe: 'response' });
    return x;
  }

  deleteFriendsByFriendId(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_friends}/${id}/deleteByFriendId`, { observe: 'response' });
  }

  deleteFriendsByFriendIdAndUserId(friendId: string, userId: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_friends}/${friendId}/${userId}/deleteByFriendIdAndUserId`, { observe: 'response' });
  }

  deleteFriendrequestByUserId(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_friendrequests}/${id}/deleteByRequestUserId`, { observe: 'response' });
  }

  deleteFriendrequestByRequestUserIdAndUserId(requestUserId: string, userId: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_friendrequests}/${requestUserId}/${userId}/deleteByRequestUserIdAndUser`, { observe: 'response' });
  }

  findFriendrequestByRequestUserId(userId: string): Observable<HttpResponse<IFriendrequest[]>> {
    return this.http
    .get<IFriendrequest[]>(`${this.resourceUrl_friendrequests}/${userId}/findByRequestUserId`, { observe: 'response' });
  }

  findFriendrequestByUserId(userId: string): Observable<HttpResponse<IFriendrequest[]>> {
    return this.http
    .get<IFriendrequest[]>(`${this.resourceUrl_friendrequests}/${userId}/findByUserId`, { observe: 'response' });
  }

  findAuthenticatedUser() {
    return this.http.get<IUser>(`${this.resourceUrl}`, { observe: 'response' });
  }

  findFriendsFromUser(userId: string): Observable<HttpResponse<IFriends[]>> {
    return this.http.get<IFriends[]>(`${this.resourceUrl_friends}/${userId}/findByUser`, { observe: 'response' });
  }

  findUserMindmapByUserId(userId: string): Observable<HttpResponse<IUserMindmap>> {
    return this.http.get<IUserMindmap>(`${this.resourceUrl_user_mindmaps}/${userId}/findByUserId`, { observe: 'response' })
    .pipe(map((res: HttpResponse<IFormulaData>) => this.convertDateFromServer(res)));
  }

  findFormulaDataByUserId(userId: string): Observable<HttpResponse<IFormulaData>> {
    return this.http
    .get<IFormulaData>(`${this.resourceUrl_formula_datas}/${userId}/findByUserId`, { observe: 'response' })
    .pipe(map((res: HttpResponse<IFormulaData>) => this.convertDateFromServer(res)));
  }

  findKeyTableByKey(key: string): Observable<HttpResponse<IFormulaData>> {
    return this.http
    .get<IFormulaData>(`${this.resourceUrl_key_tables}/${key}/findByKey`, { observe: 'response' })
    .pipe(map((res: HttpResponse<IFormulaData>) => this.keyTableService.convertDateFromServer(res)));
  }

  deleteAllFromKeyTable() {
    this.http.delete(`${this.resourceUrl_key_tables}/deleteAll`, {observe: 'response'});
  }

  convertDateFromClient(formulaData: IFormulaData): IFormulaData {
    return Object.assign({}, formulaData, {
      created: formulaData.created?.isValid() ? formulaData.created.toJSON() : undefined,
      modified: formulaData.modified?.isValid() ? formulaData.modified.toJSON() : undefined,
    });
  }

  convertDateFromServer(res: HttpResponse<IFormulaData>): HttpResponse<IFormulaData> {
    if (res.body) {
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.modified = res.body.modified ? dayjs(res.body.modified) : undefined;
    }
    return res;
  }

  convertDateArrayFromServer(res: HttpResponse<IFormulaData[]>): HttpResponse<IFormulaData[]> {
    if (res.body) {
      res.body.forEach((formulaData: IFormulaData) => {
        formulaData.created = formulaData.created ? dayjs(formulaData.created) : undefined;
        formulaData.modified = formulaData.modified ? dayjs(formulaData.modified) : undefined;
      });
    }
    return res;
  }
}
