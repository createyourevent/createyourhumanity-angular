import { Component, OnInit } from '@angular/core';
import { FieldType} from '@ngx-formly/core';
import { FormlySelectOption } from '@ngx-formly/core/select';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'jhi-multicheckbox-summary',
  templateUrl: './multicheckbox-summary.component.html',
  styleUrls: ['./multicheckbox-summary.component.scss']
})
export class MulticheckboxSummaryComponent extends FieldType implements OnInit {

  checked: any[];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.checked = this.field.formControl?.value;
  }

  getVal(n: string): number {
    return Number(n);
  }

  getBool(n: string): boolean {
    return this.checked[Number(n)];
  }

  getResult(o: FormlySelectOption, i: number): boolean {
    if(this.checked[i + 1]) {
      return true;
    } else {
      return false;
    }
  }
}
