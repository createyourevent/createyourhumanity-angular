import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { PathService } from 'app/path.service';

@Component({
  selector: 'jhi-formly-field-tabs',
  template: `
  <mat-tab-group #matTabGroup>
    <mat-tab *ngFor="let tab of field.fieldGroup; let i = index; let last = last;">
        <ng-template mat-tab-label *ngIf="getRelationSrc(tab.id)">
          {{ tab.templateOptions.label }}&nbsp;<button class="path-button" (click)="setPath($event, getRelationSrc(tab.id).dest)">{{ 'profile.button' | translate }}</button>
        </ng-template>
        <ng-template mat-tab-label *ngIf="getRelationDest(tab.id)">
          {{ tab.templateOptions.label }}&nbsp;<button class="path-button" (click)="setPath($event, getRelationDest(tab.id).src)">{{ 'profile.button' | translate }}</button>
        </ng-template>
        <ng-template mat-tab-label *ngIf="!getRelationSrc(tab.id) && !getRelationDest(tab.id)">
          {{ tab.templateOptions.label }}
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
  label: string;

  constructor(private pathService: PathService) {
    super();
  }

  ngOnInit(): void {
    this.id_link = this.field.id + '';
    this.relations = this.field.templateOptions.relations;
    this.label = this.field.templateOptions.label.trim();
  }

  getRelationSrc(id: string): any {
    const a = this.relations.find(x => x.src === id + '');
    return (a);
  }

  getRelationDest(id: string): any {
    const b = this.relations.find(x => x.dest === id + '');
    return (b);
  }

  ngAfterViewInit(): void {
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
