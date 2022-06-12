import { Component, OnInit } from '@angular/core';
import { FieldType} from '@ngx-formly/core';
import { FormlySelectOption } from '@ngx-formly/core/select';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'jhi-multiselect-summary',
  templateUrl: './multiselect-summary.component.html',
  styleUrls: ['./multiselect-summary.component.scss']
})
export class MultiselectSummaryComponent extends FieldType implements OnInit {

  checked: any[];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.checked = this.field.formControl?.value;
  }

  getResult(o: FormlySelectOption, i: number): boolean {
    if(this.checked[i]) {
      return true;
    } else {
      return false;
    }
  }
}
