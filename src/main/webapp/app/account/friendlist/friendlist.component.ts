import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
              private maincontrollerService: MaincontrollerService,
              private router: Router) { }

  ngOnInit() {
    this.sortOptions = [
      {label: 'Name', value: 'name'},
    ];

    this.accountService.identity().subscribe(account => {
      this.account = account
      if(this.account) {
        this.userService.query().subscribe(users => {
          this.user = users.body.find(x => x.id === this.account.id);
          this.maincontrollerService.findFriendsFromUser(this.user.id).subscribe(res => {
            const userFriends = res.body;
            userFriends.forEach(el => {
              const friend = users.body.find(x => x.id === el.friendId);
              this.friends.push(friend);
              this.friends = this.friends.splice(0);
            });
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

  getSearch(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  deleteFriend(id: string) {
    this.friends = [];
    this.maincontrollerService.deleteFriendsByFriendId(id).subscribe(res => {
      this.maincontrollerService.deleteFriendsByFriendIdAndUserId(this.account.id, id).subscribe(() => {
        this.maincontrollerService.deleteFriendsByFriendIdAndUserId(this.account.id, id).subscribe(() => {
          this.userService.query().subscribe(users => {
            this.user = users.body.find(x => x.id === this.account.id);
            this.maincontrollerService.findFriendsFromUser(this.user.id).subscribe(res => {
              const userFriends = res.body;
              if(userFriends.length === 0) {
                this.friends = [];
              }
              userFriends.forEach(el => {
                const friend = users.body.find(x => x.id === el.friendId);
                this.friends.push(friend);
              });
              this.friends = this.friends.splice(0);
            });
          })
        });
      });
    });
  }

  showProfile(userId: string): void {
    this.router.navigate(['/profile-view'], { queryParams: { userId: userId } });
  }

}
