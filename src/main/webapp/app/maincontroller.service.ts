import { IUserMindmap } from './entities/user-mindmap/user-mindmap.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApplicationConfigService } from './core/config/application-config.service';

@Injectable({
  providedIn: 'root'
})
export class MaincontrollerService {

  public resourceUrl_user_mindmaps = this.applicationConfigService.getEndpointFor('api/user-mindmaps');

constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) { }

findUserMindmapByUserId(userId: string): Observable<HttpResponse<IUserMindmap>> {
  return this.http.get<IUserMindmap>(`${this.resourceUrl_user_mindmaps}/${userId}/findByUserId`, { observe: 'response' });
}

}
