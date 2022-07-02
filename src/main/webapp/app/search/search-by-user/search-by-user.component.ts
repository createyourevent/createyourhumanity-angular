import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { LoginService } from 'app/login/login.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { SelectItem } from 'primeng/api';


export interface Model {
  id: number;
  text: string;
  value: string;
  grant: string;
}

@Component({
  selector: 'jhi-search-by-user',
  templateUrl: './search-by-user.component.html',
  styleUrls: ['./search-by-user.component.scss']
})
export class SearchByUserComponent implements OnInit {

  user: IUser;

  users: IUser[];

  sortOptions: SelectItem[];

  sortKey: string;

  sortField: string;

  sortOrder: number;

  xml: string;

  topics: HTMLCollectionOf<Element>;

  account: Account | null

  constructor(private maincontrollerService: MaincontrollerService,
              private router: Router,
              private mindmapService: MindmapService,
              private accountService: AccountService,
              private userService: UserService,
              private loginService: LoginService,) { }

  ngOnInit() {
    this.sortOptions = [
      {label: 'Lastname', value: 'lastName'},
      {label: 'Firstname', value: 'firstName'},
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
                if(found >= 0) {
                  this.users.splice(found, 1);
                }
              });
              this.users = this.users.splice(0);
            });

            this.maincontrollerService.findFriendrequestByRequestUserId(this.account.id).subscribe(r => {
              const reqs = r.body;
              reqs.forEach(el => {
                const found = this.users.findIndex(x => x.id === el.user.id)
                if(found >= 0) {
                  this.users.splice(found, 1);
                }
              });
              this.users = this.users.splice(0);
            });

            this.maincontrollerService.findFriendsFromUser(this.account.id).subscribe(res => {
              const userFriends = res.body;
              userFriends.forEach(el => {
                const found = this.users.findIndex(x => x.id === el.friendId);
                if(found >= 0) {
                  this.users.splice(found, 1);
                }
              });
              this.users = this.users.splice(0);
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

  showProfile(userId: string): void {
    this.router.navigate(['/profile-view'], { queryParams: { userId: userId } });
  }

  showMindmapProfile(userId: string): void {
    this.router.navigate(['/mindmap-profile'], { queryParams: { userId: userId } });
  }

  getString(event: any): string {
    return event.target.value;
  }
}
