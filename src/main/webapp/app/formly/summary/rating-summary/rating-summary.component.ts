import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { FieldType} from '@ngx-formly/core';

@Component({
  selector: 'jhi-rating-summary',
  templateUrl: './rating-summary.component.html',
  styleUrls: ['./rating-summary.component.scss']
})
export class RatingSummaryComponent extends FieldType{
  constructor(private config: NgbRatingConfig) {
    super();
    config.readonly = true;
  }
}
