import { Injectable } from '@angular/core';
import { IUser } from './entities/user/user.model';
import { Account } from './core/auth/account.model';
import { AccountService } from './core/auth/account.service';
import { MaincontrollerService } from './maincontroller.service';
import { FormulaData } from './entities/formula-data/formula-data.model';
import { fakeAsync } from '@angular/core/testing';
import { GrantsLevel } from './entities/grants-level/grants-level.model';
import { VisibilityStatus } from './entities/visibility-status/visibility-status.model';
import dayjs from 'dayjs/esm';
import { FormulaDataService } from './entities/formula-data/service/formula-data.service';
import { GrantsLevelService } from './entities/grants-level/service/grants-level.service';
import { VisibilityStatusService } from './entities/visibility-status/service/visibility-status.service';
import { IMindmap, Mindmap } from './entities/mindmap/mindmap.model';
import { MindmapService } from './entities/mindmap/service/mindmap.service';
import { UserMindmap } from './entities/user-mindmap/user-mindmap.model';
import { UserMindmapService } from './entities/user-mindmap/service/user-mindmap.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  user: IUser;
  account: Account | null = null;
  formulaData: FormulaData;
  grantsData: GrantsLevel;
  visibilityData: VisibilityStatus;
  mindmap: IMindmap;

  constructor(private accountService: AccountService,
              private maincontrollerService: MaincontrollerService,
              private formulaDataService: FormulaDataService,
              private grantsLevelService: GrantsLevelService,
              private visibilityStatusService: VisibilityStatusService,
              private mindmapService: MindmapService) { }

  initUser(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.maincontrollerService.findAuthenticatedUser().subscribe(user => {
        this.user = user.body;
        this.maincontrollerService.findFormulaDataByUserId(this.user.id).subscribe(fd => {
          if(fd.body === null) {
            this.formulaData = new FormulaData();
            this.formulaData.user = this.user;
            this.formulaData.map = {};
            this.formulaData.created = dayjs();
            this.formulaData.modified = dayjs();
            this.formulaDataService.create(this.formulaData).subscribe();
          } else {
            this.formulaData = fd.body;
          }
        });
        this.maincontrollerService.findGrantsLevelByUserId(this.user.id).subscribe(gl => {
          this.grantsData = gl.body;
          if(gl.body === null) {
            this.grantsData = new GrantsLevel();
            this.grantsData.user = this.user;
            this.grantsData.map = "{}";
            this.grantsData.created = dayjs();
            this.grantsData.modified = dayjs();
            this.grantsLevelService.create(this.grantsData).subscribe();
          } else {
            this.grantsData = gl.body
          }
        });
        this.maincontrollerService.findVisibilityStatusByUserId(this.user.id).subscribe(vs => {
          this.visibilityData = vs.body;
          if(vs.body === null) {
            this.visibilityData = new VisibilityStatus();
            this.visibilityData.user = this.user;
            this.visibilityData.map = "{}";
            this.visibilityData.created = dayjs();
            this.visibilityData.modified = dayjs();
            this.visibilityStatusService.create(this.visibilityData).subscribe();
          } else {
            this.visibilityData = vs.body;
          }
        });
      });
      });


  }



  updateGrantsFromUser(key: string, value: any) {
    let gd = JSON.parse(this.grantsData.map);
    gd = {...gd, [key]: value};
    this.grantsData.map = JSON.stringify(gd);
    this.grantsData.modified = dayjs();
    this.grantsLevelService.update(this.grantsData).subscribe();
  }
}
