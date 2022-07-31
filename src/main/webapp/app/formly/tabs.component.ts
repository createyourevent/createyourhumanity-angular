import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { PathService } from 'app/path.service';

@Component({
  selector: 'jhi-formly-field-tabs',
  template: `
  <mat-tab-group #matTabGroup>
    <mat-tab [class]="tab.templateOptions.className" *ngFor="let tab of field.fieldGroup; let i = index; let last = last;">
      <ng-template mat-tab-label>
        {{ tab.templateOptions.label }}&nbsp;<ng-container *ngFor="let r of rels"><ng-container *ngIf="r.label === tab.templateOptions.label"><button class="path-button" (click)="setPath($event, r.dest)">{{ 'profile.button' | translate }}</button></ng-container></ng-container>
      </ng-template>
      <formly-field [field]="tab"></formly-field>
    </mat-tab>
  </mat-tab-group>
`,
})
export class FormlyFieldTabsComponent extends FieldType implements OnInit, AfterViewInit {

  @ViewChild('matTabGroup') matTabGroup: MatTabGroup;

  index: number;
  relations:any[] = [];
  id_link: string;
  rels: any[] = [];

  constructor(private pathService: PathService) {
    super();
  }

  ngOnInit(): void {
    this.id_link = this.field.id;
    this.relations = this.field.templateOptions.relations;
    this.rels = this.field.templateOptions.rels;
  }

  ngAfterViewInit(): void {
    this.id_link = this.field.id;
    this.relations = this.field.templateOptions.relations;
    if(Number(this.field.selectedIndex) >= 0) {
      this.index = Number(this.field.selectedIndex);
      this.focusTab(this.index);
    }
  }

  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup
      ? field.fieldGroup.every((f) => this.isValid(f))
      : true;
  }

  focusTab(id: number) {
    this.matTabGroup.animationDone.subscribe(() => {
      this.matTabGroup.selectedIndex = id;
      this.matTabGroup.focusTab(id);
    });
  }

  setPath(event: any, path: string) {
    this.pathService.setPath(Number(path));
    event.stopPropagation();
  }
}
