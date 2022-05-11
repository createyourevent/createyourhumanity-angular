import { Component, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { Friendrequest } from 'app/entities/friendrequest/friendrequest.model';
import { FriendrequestService } from 'app/entities/friendrequest/service/friendrequest.service';
import { IFriends } from 'app/entities/friends/friends.model';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { LoginService } from 'app/login/login.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { SelectItem } from 'primeng/api';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {

  account: Account | null = null;
  user: IUser;
  users: IUser[] = [];
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;

  constructor(private accountService: AccountService,
              private userService: UserService,
              private loginService: LoginService,
              private maincontrollerService: MaincontrollerService,
              private friendrequestService: FriendrequestService) { }

  ngOnInit() {
    this.sortOptions = [
      {label: 'Name', value: 'name'},
    ];

    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.userService.query().subscribe(users => {
          this.user = users.body.find(x => x.id === this.account.id);
          this.userService.query().subscribe(users => {
            this.users = users.body;
          })
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

  getSearch(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  addFriendRequest(userId: string): void {
    const req = new Friendrequest(userId);
    req.requestDate = dayjs();
    req.user = this.user;
    req.info = '';
    this.friendrequestService.create(req).subscribe();
  }
}
