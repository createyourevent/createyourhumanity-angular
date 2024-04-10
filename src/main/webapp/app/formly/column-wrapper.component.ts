import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-column-wrapper',
  template: `
  <div class="col">
  <div class="col">
    <ng-template #fieldComponent></ng-template>
  </div>
  </div>
`,
})
export class ColumnWrapperComponent extends FieldWrapper {}
