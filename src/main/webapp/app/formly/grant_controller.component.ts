import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { Grants } from 'app/core/enums/grants';
import { FormControl } from '@angular/forms';
import { GrantsLevel } from 'app/entities/grants-level/grants-level.model';
import { UserService } from '../user.service';
import { KeyTable } from '../entities/key-table/key-table.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { IUser, User } from 'app/entities/user/user.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'jhi-formly-wrapper-expansion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:`
      <h3 class="card-label-header">{{ to.label }}</h3>
      <div class="card-body">
        <ng-container #fieldComponent></ng-container>
      </div>
  <hr/>
  <div class="form-field-label">Viewing permissions:</div>
  <mat-form-field>
  <mat-label>Permission</mat-label>
  <mat-select [(value)]="selectedGrant" (selectionChange)="selectOption($event)">
    <mat-option *ngFor="let option of grantOptions | keyvalue;" [value]="option.key">
      {{ option.value }}
    </mat-option>
  </mat-select>
</mat-form-field>
`,
})
export class FormlyGrantsComponent extends FieldWrapper implements OnInit {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;

  grantOptions = Object.values(Grants);
  selectedGrant: Grants;
  account: Account | null = null;
  grants_level: GrantsLevel;
  user: IUser;
  userId: string;

  constructor(private userService: UserService,private accountService: AccountService,
              private maincontrollerService: MaincontrollerService, private cdr: ChangeDetectorRef) {
    super();
  }
  ngOnInit(): void {
    this.maincontrollerService.findAuthenticatedUser().subscribe(res => {
      this.user = res.body;
      this.userId = this.user.id;
      this.maincontrollerService.findGrantsLevelByUserId(this.userId).subscribe(data => {
        this.grants_level = data.body;
        let data_grants = JSON.parse(this.grants_level.map);
        this.selectedGrant = data_grants[Number(this.field.id)];
        this.cdr.markForCheck();
      });
    });
  }

    selectOption(event) {
      let idx = this.field.id;

      this.maincontrollerService.findGrantsLevelByUserId(this.userId).subscribe(data => {
        this.grants_level = data.body;
        let data_grants = JSON.parse(this.grants_level.map);
        this.selectedGrant = data_grants[Number(this.field.id)];

        this.cdr.markForCheck();
      });


    }
}
