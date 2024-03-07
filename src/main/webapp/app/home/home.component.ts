import { Component, OnInit } from '@angular/core';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/user.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  account: Account | null = null;
  user: IUser;

  constructor(private accountService: AccountService,
              private loginService: LoginService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
        this.account = account
    });
  }

  login(): void {
    this.loginService.login();
  }
}
