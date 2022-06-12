import { Component, OnInit } from '@angular/core';
import { FieldType} from '@ngx-formly/core';

@Component({
  selector: 'jhi-editor-summary',
  templateUrl: './editor-summary.component.html',
  styleUrls: ['./editor-summary.component.scss']
})
export class EditorSummaryComponent extends FieldType implements OnInit {

  html: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.html = this.field.formControl.value;
  }

}
