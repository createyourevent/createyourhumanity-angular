import { Component, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { UserService } from 'app/entities/user/user.service';
import { MaincontrollerService } from 'app/maincontroller.service';

@Component({
  selector: 'jhi-friendrequests',
  templateUrl: './friendrequests.component.html',
  styleUrls: ['./friendrequests.component.scss']
})
export class FriendrequestsComponent implements OnInit {

  account: Account | null = null;

  constructor(private accountService: AccountService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,) { }

  ngOnInit() {
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.mainController.findFriendrequestByUserId(this.account.id)
      });
  }

}
