import { Friends } from './../entities/friends/friends.model';
import { Component, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IFriendrequest } from 'app/entities/friendrequest/friendrequest.model';
import { FriendsService } from 'app/entities/friends/service/friends.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { SelectItem } from 'primeng/api';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-friendrequests',
  templateUrl: './friendrequests.component.html',
  styleUrls: ['./friendrequests.component.scss']
})
export class FriendrequestsComponent implements OnInit {

  account: Account | null = null;
  user: IUser;
  // requestingUsers: {user: IUser, own: boolean}[] = [];
  requests: IFriendrequest[] =  [];
  requestsUsers: IUser[] = [];
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;

  constructor(private accountService: AccountService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,
              private friendsService: FriendsService ) { }

  ngOnInit() {
    this.sortOptions = [
      {label: 'Name', value: 'name'},
    ];

    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        let users: IUser[] = null;
        this.userService.query().subscribe(res => {
          users = res.body;
          this.user = res.body.find(x => x.id === this.account.id);
        });
        this.maincontrollerService.findFriendrequestByRequestUserId(this.account.id).subscribe(res => {
          this.requests = res.body;
          let i = 0;
          this.requests.forEach(el => {
              i++;
              const user = users.find(x => x.id === el.user.id);
              this.requestsUsers.push(user);
              if(i === this.requests.length) {
                this.requestsUsers = this.requestsUsers.splice(0);
              }
          });
        });
      }
    });
  }

  requestedUser(id: string): boolean {
    if(id !== this.account.id) {
      return true;
    }
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

  addUser(id: string): void {
    this.userService.query().subscribe(res => {
      const users = res.body;
      const user = users.find(x => x.id === id);
      const f: Friends = new Friends();
      f.connectDate = dayjs();
      f.user = this.user;
      f.friendId = id;
      this.friendsService.create(f).subscribe(r => {
        const s: Friends = new Friends();
        s.connectDate = f.connectDate;
        s.user = user;
        s.friendId = this.user.id;
        this.friendsService.create(s).subscribe(() => {
          this.deleteRequest(id);
        });
      });
    });
  }

  deleteRequest(id: string) {
    this.requestsUsers = [];
    this.maincontrollerService.deleteFriendrequestByRequestUserIdAndUserId(id, this.account.id).subscribe(del => {
        this.maincontrollerService.deleteFriendrequestByRequestUserIdAndUserId(this.account.id, id).subscribe(del => {
          this.maincontrollerService.findFriendrequestByUserId(this.account.id).subscribe(res => {
            let users: IUser[] = null;
            this.userService.query().subscribe(res => {
              users = res.body;
            });
            this.requests = res.body;
            let i = 0;
            this.requests.forEach(el => {
                i++;
                const user = users.find(x => x.id === el.user.id);
                this.requestsUsers.push(user);
                // this.requestingUsers.push({user: user , own: el.user.id === this.account.id });
                if(i === this.requests.length) {
                  this.requestsUsers = this.requestsUsers.splice(0);
                  // this.requestingUsers = this.requestingUsers.splice(0);
                }
            });
         });
      });
    });
  }
}
