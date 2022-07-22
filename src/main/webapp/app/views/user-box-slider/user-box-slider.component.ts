import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { Friendrequest } from 'app/entities/friendrequest/friendrequest.model';
import { FriendrequestService } from 'app/entities/friendrequest/service/friendrequest.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-user-box-slider',
  templateUrl: './user-box-slider.component.html',
  styleUrls: ['./user-box-slider.component.scss']
})
export class UserBoxSliderComponent implements OnInit, OnChanges {

  responsiveOptions;
  users: IUser[];
  account: Account | null = null;
  user: IUser;

  @Input() userId: string;

  constructor(private maincontrollerService: MaincontrollerService,
              private router: Router,
              private accountService: AccountService,
              private userService: UserService,
              private friendrequestService: FriendrequestService,) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['userId'].currentValue !== undefined) {
      this.userId = changes['userId'].currentValue;
    }
  }

  ngOnInit() {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  if(!this.userId) {
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
      }
    });
  } else {
    this.maincontrollerService.findUserWithUserId(this.userId).subscribe(u => {
      this.user = u.body;
    }
    );
  }
  }

  addFriendRequest(userId: string): void {
    this.users = [];
    const req = new Friendrequest();
    req.requestDate = dayjs();
    req.requestUserId = userId;
    req.user = this.user;
    req.info = '';
    this.friendrequestService.create(req).subscribe(res => {
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
    });
  }

  showProfile(userId: string): void {
    this.router.navigate(['/profile-view'], { queryParams: { userId: userId } });
  }

  showMindmapProfile(userId: string): void {
    this.router.navigate(['/mindmap-profile'], { queryParams: { userId: userId } });
  }

}
