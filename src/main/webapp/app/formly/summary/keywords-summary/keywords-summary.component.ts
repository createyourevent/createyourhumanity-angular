import { Component, OnInit } from '@angular/core';
import { FieldType} from '@ngx-formly/core';

@Component({
  selector: 'jhi-keywords-summary',
  templateUrl: './keywords-summary.component.html',
  styleUrls: ['./keywords-summary.component.scss']
})
export class KeywordsSummaryComponent extends FieldType implements OnInit {

  keywords: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.keywords = this.field.formControl?.value;
  }
}
