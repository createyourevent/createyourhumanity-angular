import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { IUser } from 'app/entities/user/user.model';
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

  constructor(private maincontrollerService: MaincontrollerService, private router: Router, private mindmapService: MindmapService) { }

  ngOnInit() {
    this.sortOptions = [
      {label: 'Lastname', value: 'lastName'},
      {label: 'Firstname', value: 'firstName'},
    ];

    this.maincontrollerService.findAuthenticatedUserWithFormulaData().subscribe(u => {
      this.user = u.body;
      this.maincontrollerService.findAllUsersWithFormulaData().subscribe(us => {
        this.users = us.body;
        this.mindmapService.query().subscribe(mm => {
          this.xml = mm.body[0].text;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(this.xml,"text/xml");
          this.topics = xmlDoc.getElementsByTagName("topic");
          for(let i = 0; i < this.topics.length; i++) {
            const id = this.topics[i].getAttribute('id');
          }
        })
      });
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
