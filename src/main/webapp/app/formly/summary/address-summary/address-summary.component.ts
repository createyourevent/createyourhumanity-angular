import { Component, OnInit } from '@angular/core';
import { FieldType} from '@ngx-formly/core';

@Component({
  selector: 'jhi-address-summary',
  templateUrl: './address-summary.component.html',
  styleUrls: ['./address-summary.component.scss']
})
export class AddressSummaryComponent extends FieldType implements OnInit {

  address: string;
  formatedAddress: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
      this.address = this.field.formControl.value.split(',');
      this.formatedAddress = this.address[0] + '<br/>' + this.address[1] + '<br>' + this.address[2];
  }
}
