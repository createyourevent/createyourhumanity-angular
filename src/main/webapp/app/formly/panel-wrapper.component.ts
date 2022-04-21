import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-wrapper-panel',
  template: `
    <div class="panel card">
      <div class="card-header">
        <h3 class="title" [style]="margin">{{ to.label }}</h3>
        <div class="expandable">
          <a (click)="setExpanded()">+Expand+</a>
        </div>
      </div>
      <div class="card-body" [style] = "style">
        <ng-container #fieldComponent></ng-container>
      </div>
    </div>
  `,
})
export class PanelWrapperComponent extends FieldWrapper {

  expanded = true;
  style = "display: none";
  margin = "margin-left: 0px";

  constructor() {
    super();

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
