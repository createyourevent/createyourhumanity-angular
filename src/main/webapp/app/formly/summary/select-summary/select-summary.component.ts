import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FieldType} from '@ngx-formly/core';

@Component({
  selector: 'jhi-select-summary',
  templateUrl: './select-summary.component.html',
  styleUrls: ['./select-summary.component.scss']
})
export class SelectSummaryComponent extends FieldType{}
