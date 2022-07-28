import { Component, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { Group, IGroup } from 'app/entities/group/group.model';
import { GroupService } from 'app/entities/group/service/group.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { ConfirmationService, MessageService } from 'primeng/api';

interface GroupItem {
  name: string,
  id: string,
}

@Component({
  selector: 'jhi-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  groups: IGroup[] = [];
  account: Account | null = null;
  groupDialog: boolean;
  group: IGroup;

  selectedGroups: IGroup[];
  submitted: boolean;
  friends: any[];
  allFriends: any[] = [];
  selectedUsers: any[] = [];

  groupItems: GroupItem[] = [];
  selectedGroupItem: GroupItem;

  constructor(private maincontrollerService: MaincontrollerService,
              private accountService: AccountService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private groupService: GroupService,
              private userService: UserService) {

  }
  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.maincontrollerService.findGroupsByOwnerId(this.account.id).subscribe(res => {
        this.groups = res.body;
        this.groups.forEach(el => {
          this.groupItems.push({name: el.name, id: el.id});
        });
      });
    });
  }
  openNew() {
    this.group = new Group();
    this.submitted = false;
    this.groupDialog = true;
}

changeGroup(event) {
  this.allFriends = [];
  this.selectedUsers = [];
  this.maincontrollerService.findFriendsFromUser(this.account.id).subscribe(res => {
    const friends = res.body;
    friends.forEach(f => {
      this.maincontrollerService.findUserWithUserId(f.friendId).subscribe(re => {
        const user = re.body;
        if(user.groups && user.groups.findIndex(x => x.id === event.value.id) >= 0) {
          this.selectedUsers.push(user);
          this.selectedUsers = this.selectedUsers.splice(0);
        } else {
          this.allFriends.push(user);
          this.allFriends = this.allFriends.splice(0);
        }
      })
    })
  })
}

moveToTarget(event) {
  for(let i = 0; i < event.items.length; i++) {
    this.groupService.find(this.selectedGroupItem.id).subscribe(t => {
      const group = t.body;
      const user: IUser = event.items[i];
      user.groups.push(group);
      this.userService.update(user).subscribe();
      group.users.push(user);
      this.groupService.update(group).subscribe();
    });
  }
}

moveToSource(event) {
  for(let i = 0; i < event.items.length; i++) {
    this.groupService.find(this.selectedGroupItem.id).subscribe(t => {
      const group = t.body;
      const user: IUser = event.items[i];
      const fi = user.groups.findIndex(g => g.id === group.id);
      if(fi >= 0) {
        user.groups.splice(fi, 1);
        this.userService.update(user).subscribe();
      }
      const fi2 = group.users.findIndex(u => u.id === user.id);
      if(fi2 >= 0) {
        group.users.splice(fi2, 1);
        this.groupService.update(group).subscribe();
      }
    });
  }
}

deleteSelectedGroups() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected groups?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.groups = this.groups.filter(val => !this.selectedGroups.includes(val));
            this.selectedGroups.forEach(sg => {
              const fi = this.groupItems.findIndex(x => x.id === sg.id);
              if(fi >= 0) {
                this.groupItems.splice(fi, 1);
              }
              this.groupService.delete(sg.id).subscribe();
            });
            this.selectedGroups = null;
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Groups Deleted', life: 3000});
        }
    });
}

editGroup(group: IGroup) {
    this.group = {...group};
    this.groupDialog = true;
}

deleteGroup(group: IGroup) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + group.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.groups = this.groups.filter(val => val.id !== group.id);
            const fi = this.groupItems.findIndex(x => x.id === group.id);
            if(fi >= 0) {
              this.groupItems.splice(fi, 1);
            }
            this.groupService.delete(group.id).subscribe();
            this.group = {};
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Group Deleted', life: 3000});
        }
    });
}

hideDialog() {
    this.groupDialog = false;
    this.submitted = false;
}

saveProduct() {
    this.submitted = true;
    this.maincontrollerService.findAuthenticatedUser().subscribe(u => {
      this.group.owner = u.body;
      if (this.group.name.trim()) {
        if (this.group.id) {
            this.groups[this.findIndexById(this.group.id)] = this.group;
            this.groupService.update(this.group).subscribe();
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Group Updated', life: 3000});
        }
        else {
            this.groupItems.push({name: this.group.name, id: this.group.id});
            this.group.users = [u.body];
            this.groups.push(this.group);
            this.groupService.create(this.group).subscribe();
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Group Created', life: 3000});
        }

        this.groups = [...this.groups];
        this.groupDialog = false;
        this.group = {};
    }
    });
}

findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.groups.length; i++) {
        if (this.groups[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

getValue(event): string {
  const element = event.currentTarget as HTMLInputElement;
  const value = element.value;
  return value;
}

}
