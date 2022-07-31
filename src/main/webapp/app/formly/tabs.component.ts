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
        {{ tab.templateOptions.label }}&nbsp;<ng-container *ngIf="hasRelation(tab.id)"><button class="path-button" (click)="setPath($event, id_link)">{{ 'profile.button' | translate }}</button></ng-container>
      </ng-template>
      <formly-field [field]="tab"></formly-field>
    </mat-tab>
  </mat-tab-group>
`,
})
export class FormlyFieldTabsComponent extends FieldType implements AfterViewInit {

  @ViewChild('matTabGroup') matTabGroup: MatTabGroup;

  index: number;
  relations:any[] = [];
  id_link: string;

  constructor(private pathService: PathService) {
    super();
  }
  ngAfterViewInit(): void {
    this.id_link = this.field.id;
    this.relations = this.field.templateOptions.relations;
    if(Number(this.field.selectedIndex) >= 0) {
      this.index = Number(this.field.selectedIndex);
      this.focusTab(this.index);
    }
  }

  hasRelation(id: string): boolean {
    if(this.relations.find(x => x.src === id + '')) {
      return true;
    }
    return false;
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
    const s = this.relations.find(x => x.src === path + '');
    this.pathService.setPath(Number(s.dest));
    event.stopPropagation();
  }
}
