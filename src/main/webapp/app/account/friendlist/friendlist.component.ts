import { Component, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IFriends } from 'app/entities/friends/friends.model';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { LoginService } from 'app/login/login.service';
import { MaincontrollerService } from 'app/maincontroller.service';

@Component({
  selector: 'jhi-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.scss']
})
export class FriendlistComponent implements OnInit {

  account: Account | null = null;
  user: IUser;
  friends: IFriends[] = [];

  constructor(private accountService: AccountService,
              private userService: UserService,
              private loginService: LoginService,
              private maincontrollerService: MaincontrollerService) { }

  ngOnInit() {
    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.userService.query().subscribe(users => {
          this.user = users.body.find(x => x.id === this.account.id);
          this.maincontrollerService.findFriendsFromUser(this.account.id).subscribe(friends => {
            this.friends = friends.body;
          });
        })
      } else {
        this.loginService.login()
      }
  }

}
