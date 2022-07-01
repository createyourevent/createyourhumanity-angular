import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-wrapper-panel',
  template: `
  <mat-expansion-panel #matExpansionPanel [id]="id_link" [expanded]="expanded" [formlyAttributes]="field">
    <mat-expansion-panel-header style="background-color:{{ bgColor }}; color:{{ color }}">
      <mat-panel-title>
      {{ to.label }}
      </mat-panel-title>
    </mat-expansion-panel-header>
    <mat-accordion #accordion_field [multi]="false" displayMode="default">
      <ng-container #fieldComponent></ng-container>
    </mat-accordion>
  </mat-expansion-panel>
  `,
})
export class ExpansionPanelComponent extends FieldWrapper implements AfterViewInit {

  @ViewChild('matExpansionPanel') matExpansionPanel: MatExpansionPanel;

  bgColor: string;
  color: string;
  id_link: string;
  expanded = 'false';

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.bgColor = this.field.templateOptions.bgColor;
    this.color = this.field.templateOptions.color;
    this.id_link = this.field.id;
    this.expanded = this.field.templateOptions.expanded;
    this.setExpandet();
  }

  setExpandet(): void {
    if(this.expanded === 'true') {
        this.matExpansionPanel.expanded = true;
        this.matExpansionPanel.open();
    }
  }
}
