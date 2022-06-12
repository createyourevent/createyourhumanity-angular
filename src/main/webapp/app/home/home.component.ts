import { Component, OnInit } from '@angular/core';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import { FormulaData } from 'app/entities/formula-data/formula-data.model';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import dayjs from 'dayjs/esm'

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  account: Account | null = null;

  constructor(private accountService: AccountService,
              private loginService: LoginService,
              private maincontrollerService: MaincontrollerService,
              private formulaDataService: FormulaDataService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.maincontrollerService.findAuthenticatedUserWithFormulaData().subscribe(u => {
        const user = u.body;
        if(user.formulaData === null) {
          const formulaData = new FormulaData();
          const now = dayjs();
          formulaData.created = now;
          formulaData.grant = "{}";
          formulaData.map = "{}";
          formulaData.modified = now;
          formulaData.user = user;
          this.formulaDataService.create(formulaData).subscribe();
        }
      });
    });
  }

  login(): void {
    this.loginService.login();
  }
}
