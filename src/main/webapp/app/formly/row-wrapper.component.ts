import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-row-wrapper',
  template: `
  <div class="row">
    <ng-template #fieldComponent></ng-template>
  </div>
`,
})
export class RowWrapperComponent extends FieldWrapper {}
