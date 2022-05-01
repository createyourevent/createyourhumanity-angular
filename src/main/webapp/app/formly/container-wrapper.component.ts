import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-container-wrapper',
  template: `
  <div class="container">
    <ng-template #fieldComponent></ng-template>
  </div>
`,
})
export class ContainerWrapperComponent extends FieldWrapper  {}
