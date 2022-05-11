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
            const self = this.users.findIndex(x => x.id === this.account.id);
            this.users.splice(self, 1);
            this.users = this.users.splice(0);
            this.maincontrollerService.findFriendrequestByUserId(this.account.id).subscribe(r => {
              const reqs = r.body;
              reqs.forEach(el => {
                const found = this.users.findIndex(x => x.id === el.requestUserId)
                if(found) {
                  this.users.splice(found, 1);
                }
                this.users = this.users.splice(0);
              });
            });
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
    const req = new Friendrequest();
    req.requestDate = dayjs();
    req.requestUserId = userId;
    req.user = this.user;
    req.info = '';
    this.friendrequestService.create(req).subscribe();
  }
}
