import { IUser } from 'app/entities/user/user.model';
import { IFormulaData } from './entities/formula-data/formula-data.model';
import { IUserMindmap } from './entities/user-mindmap/user-mindmap.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApplicationConfigService } from './core/config/application-config.service';
import dayjs from 'dayjs/esm';
import { map } from 'rxjs';
import { KeyTableService } from './entities/key-table/service/key-table.service';
import { IFriends } from './entities/friends/friends.model';
import { IFriendrequest } from './entities/friendrequest/friendrequest.model';
import { IGrantsLevel } from './entities/grants-level/grants-level.model';
import { IVisibilityStatus } from './entities/visibility-status/visibility-status.model';

@Injectable({ providedIn: 'root' })
export class MaincontrollerService {

  public resourceUrl_user_mindmaps = this.applicationConfigService.getEndpointFor('api/user-mindmaps');
  public resourceUrl_formula_datas = this.applicationConfigService.getEndpointFor('api/formula-data');
  public resourceUrl_grants_level = this.applicationConfigService.getEndpointFor('api/grants-level');
  public resourceUrl_key_tables = this.applicationConfigService.getEndpointFor('api/key-tables');
  public resourceUrl_friends = this.applicationConfigService.getEndpointFor('api/friends');
  public resourceUrl_friendrequests = this.applicationConfigService.getEndpointFor('api/friendrequests');
  public resourceUrl_visibility_status = this.applicationConfigService.getEndpointFor('api/visibility-status');

  public resourceUrl = this.applicationConfigService.getEndpointFor('api/authenticatedUser');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService, private keyTableService: KeyTableService) { }

  deleteFriendsByFriendId(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_friends}/${id}/deleteByFriendId`, { observe: 'response' });
  }

  deleteFriendrequestByUserId(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_friendrequests}/${id}/deleteByRequestUserId`, { observe: 'response' });
  }

  findFriendrequestByUserId(userId: string): Observable<HttpResponse<IFriendrequest[]>> {
    return this.http
    .get<IFriendrequest[]>(`${this.resourceUrl_friendrequests}/${userId}/findByRequestUserId`, { observe: 'response' });
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

  findGrantsLevelByUserId(userId: string): Observable<HttpResponse<IGrantsLevel>> {
    return this.http
      .get<IGrantsLevel>(`${this.resourceUrl_grants_level}/${userId}/findByUserId`, { observe: 'response' })
      .pipe(map((res: HttpResponse<IGrantsLevel>) => this.convertDateFromServerForGrantsLevel(res)));
  }

  findVisibilityStatusByUserId(userId: string): Observable<HttpResponse<IVisibilityStatus>> {
    return this.http
      .get<IVisibilityStatus>(`${this.resourceUrl_visibility_status}/${userId}/findByUserId`, { observe: 'response' })
      .pipe(map((res: HttpResponse<IVisibilityStatus>) => this.convertDateFromServerForVisibilityStatus(res)));
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

  setPath(nodes: number[]) {

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

  convertDateFromServerForGrantsLevel(res: HttpResponse<IGrantsLevel>): HttpResponse<IGrantsLevel> {
    if (res.body) {
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.modified = res.body.modified ? dayjs(res.body.modified) : undefined;
    }
    return res;
  }

  convertDateFromServerForVisibilityStatus(res: HttpResponse<IVisibilityStatus>): HttpResponse<IVisibilityStatus> {
    if (res.body) {
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.modified = res.body.modified ? dayjs(res.body.modified) : undefined;
    }
    return res;
  }
}
