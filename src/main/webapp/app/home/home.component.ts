import { AfterViewInit, Component, OnInit } from '@angular/core';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import { FormulaData } from 'app/entities/formula-data/formula-data.model';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import dayjs from 'dayjs/esm'
import { DesignerGlobalService } from 'app/designer-global.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  account: Account | null = null;

  constructor(private accountService: AccountService,
              private loginService: LoginService,
              private maincontrollerService: MaincontrollerService,
              private formulaDataService: FormulaDataService,
              private designerGlobalService: DesignerGlobalService,) {}


  ngAfterViewInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.maincontrollerService.findAuthenticatedUserWithFormulaData().subscribe(u => {
        const user = u.body;
        const designer = global.designer;
        this.designerGlobalService.setDesigner(designer);
        if(user.formulaData === null) {
          const formulaData = new FormulaData();
          const now = dayjs();
          formulaData.created = now;
          formulaData.grant = "{}";
          formulaData.map = "{}";
          formulaData.visible = "{}";
          const visible = new Map<string, unknown>();
          formulaData.visible = JSON.stringify(Object.fromEntries(this.domWalker(designer.getModel().findTopicById(1), visible)));
          formulaData.modified = now;
          formulaData.user = user;
          this.formulaDataService.create(formulaData).subscribe();
        }
      });
    });
  }

  domWalker(node, map) {
    const vis = map.get(node.getId() + '');
    if(!vis) {
      map.set(node.getId()+'', 'visible_visible');
    }
    if (node.getChildren().length > 0) {
      node.getChildren().forEach(childNode => {
        this.domWalker(childNode, map);
      });
    }
    return map;
  }

  login(): void {
    this.loginService.login();
  }
}
