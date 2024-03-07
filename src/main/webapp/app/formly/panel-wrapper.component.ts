import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { Grants } from 'app/core/enums/grants';

@Component({
  selector: 'jhi-formly-wrapper-panel',
  template: `
    <div class="panel card" [style] = "margin">
      <div class="card-header" style="background-color:{{ bgColor }}; color:{{ color }}">
        <h3 class="title" [style]="margin">{{ to.label }}</h3>
        <div class="expandable">
          <a (click)="setExpanded()">+Expand+</a>
        </div>
      </div>
      <div class="card-body" [style] = "style">
        <ng-container #fieldComponent></ng-container>
      </div>
  `,
})
export class PanelWrapperComponent extends FieldWrapper implements OnInit {

  expanded = true;
  style = "display: none";
  margin = "margin-top: 4px; margin-bottom: 4px;";
  bgColor: string;
  color: string;

  constructor() {
    super();
    // this.bgColor = this.field.templateOptions;
  }
  ngOnInit(): void {
    this.bgColor = this.field.templateOptions.bgColor;
    this.color = this.field.templateOptions.color;
  }



  setExpanded(): void {
    if(this.expanded) {
      this.style = "display: block";
      this.expanded = false;
    } else {
      this.style = "display: none";
      this.expanded = true;
    }
  }
}
