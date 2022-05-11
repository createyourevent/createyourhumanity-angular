import { Component, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IFriendrequest } from 'app/entities/friendrequest/friendrequest.model';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'jhi-friendrequests',
  templateUrl: './friendrequests.component.html',
  styleUrls: ['./friendrequests.component.scss']
})
export class FriendrequestsComponent implements OnInit {

  account: Account | null = null;
  requests: IFriendrequest[] =  [];
  requestsUsers: IUser[] = [];
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;

  constructor(private accountService: AccountService,
              private maincontrollerService: MaincontrollerService,
              private userService: UserService,) { }

  ngOnInit() {
    this.sortOptions = [
      {label: 'Name', value: 'name'},
    ];

    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.maincontrollerService.findFriendrequestByUserId(this.account.id).subscribe(res => {
          this.requests = res.body;
          let i = 0;
          this.requests.forEach(el => {
            this.userService.query().subscribe(u => {
              i++;
              const users = u.body;
              const user = users.find(x => x.id === el.requestUserId);
              this.requestsUsers.push(user);
              if(i === this.requests.length) {
                this.requestsUsers = this.requestsUsers.splice(0);
              }
            })
          });
        });
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

  addUser(id: string): void {
    console.log(id);
  }
}
