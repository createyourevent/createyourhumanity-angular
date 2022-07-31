import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FieldWrapper } from '@ngx-formly/core';
import { PathService } from 'app/path.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'jhi-formly-wrapper-panel',
  template: `
  <mat-expansion-panel #matExpansionPanel [id]="id_link" [expanded]="expanded" [formlyAttributes]="field">
    <mat-expansion-panel-header style="background-color:{{ bgColor }}; color:{{ color }}">
      <mat-panel-title>
      {{ to.label }}
      </mat-panel-title>
      <mat-panel-description *ngIf="rels">
          <ng-container *ngFor="let r of rels"><button class="path-button" (click)="setPath($event, r.dest)">{{ 'profile.button' | translate }}</button>&nbsp;</ng-container>
      </mat-panel-description>
    </mat-expansion-panel-header>
    <mat-accordion #accordion_field [multi]="false" displayMode="default">
      <ng-container #fieldComponent></ng-container>
    </mat-accordion>
  </mat-expansion-panel>
  `,
})
export class ExpansionPanelComponent extends FieldWrapper implements OnInit, AfterViewInit {

  @ViewChild('matExpansionPanel') matExpansionPanel: MatExpansionPanel;

  bgColor: string;
  color: string;
  id_link: string;
  expanded = 'false';
  relations:any[] = [];
  rels: any[] = [];

  constructor(private pathService: PathService) {
    super();
  }
  ngOnInit(): void {
    this.bgColor = this.field.templateOptions.bgColor;
    this.color = this.field.templateOptions.color;
    this.id_link = this.field.id;
    this.expanded = this.field.templateOptions.expanded;
    this.relations = this.field.templateOptions.relations;
    this.relations.forEach(el => {
      if(el.src === this.id_link + '') {
        this.rels.push({src: el.src, dest: el.dest});
      }else if(el.dest === this.id_link + '') {
        this.rels.push({src: el.dest, dest: el.src});
      }
    });
  }

  ngAfterViewInit(): void {
    this.setExpandet();
  }

  setExpandet(): void {
    if(this.expanded === 'true') {
        this.matExpansionPanel.expanded = true;
        this.matExpansionPanel.open();
    }
  }

  setPath(event: any, path: string) {
    this.pathService.setPath(Number(path));
    event.stopPropagation();
  }
}
