import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FieldType} from '@ngx-formly/core';

@Component({
  selector: 'jhi-textarea-summary',
  templateUrl: './textarea-summary.component.html',
  styleUrls: ['./textarea-summary.component.scss']
})
export class TextareaSummaryComponent extends FieldType{}
