import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldType, FieldTypeConfig, FieldWrapper } from '@ngx-formly/core';
import { Grants } from 'app/core/enums/grants';
import { GrantsLevel } from 'app/entities/grants-level/grants-level.model';
import { UserService } from '../user.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { AccountService } from 'app/core/auth/account.service';
import { IUser } from 'app/entities/user/user.model';
import { GrantsLevelService } from 'app/entities/grants-level/service/grants-level.service';

@Component({
  selector: 'jhi-formly-wrapper-expansion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 class="card-label-header">{{ to.label }}</h3>
    <div class="card-body">
      <ng-container #fieldComponent></ng-container>
    </div>
    <hr/>
    <div class="form-field-label">Viewing permissions:</div>
    <mat-form-field>
      <mat-label>Permission</mat-label>
      <mat-select [(value)]="selectedGrant" (selectionChange)="onGrantSelectionChange(field.id, selectedGrant)">
        <mat-option *ngFor="let grant of grantOptions" [value]="grant">
          {{ grant }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
})
export class FormlyGrantsComponent extends FieldType<FieldTypeConfig> implements OnInit {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;

  grantOptions = Object.values(Grants);
  selectedGrant: Grants;
  account: IUser;
  grantsLevel: GrantsLevel;

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private maincontrollerService: MaincontrollerService,
    private cdr: ChangeDetectorRef,
    private grantsLevelService: GrantsLevelService
  ) {
    super();
  }

  ngOnInit(): void {
    this.maincontrollerService.findAuthenticatedUser().subscribe(res => {
      this.account = res.body;
      this.maincontrollerService.findGrantsLevelByUserId(this.account.id).subscribe(data => {
        this.grantsLevel = data.body;
        const grantsMap = JSON.parse(this.grantsLevel.map);
        this.selectedGrant = grantsMap[Number(this.field.id)] || Grants.NONE;
        this.cdr.markForCheck();
      });
    });
  }

  onGrantSelectionChange(fieldId: string, grant: Grants) {
    const grantsMap = JSON.parse(this.grantsLevel.map);
    grantsMap[fieldId] = grant;
    this.grantsLevel.map = JSON.stringify(grantsMap);

    this.grantsLevelService.update(this.grantsLevel).subscribe(
      data => {
        this.grantsLevel = data.body;
        this.cdr.markForCheck();
      },
      error => {
        console.error('Error updating grants level:', error);
      }
    );
  }
}
