import { Component, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IFriends } from 'app/entities/friends/friends.model';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { LoginService } from 'app/login/login.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'jhi-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.scss']
})
export class FriendlistComponent implements OnInit {

  account: Account | null = null;
  user: IUser;
  friends: IFriends[] = [];
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;

  constructor(private accountService: AccountService,
              private userService: UserService,
              private loginService: LoginService,
              private maincontrollerService: MaincontrollerService) { }

  ngOnInit() {
    this.sortOptions = [
      {label: 'Name', value: 'name'},
  ];

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
    });
  }

  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
    }
}
}
