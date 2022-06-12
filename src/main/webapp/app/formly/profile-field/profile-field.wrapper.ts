import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Self } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { assignGrantFieldValue, FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps} from '@ngx-formly/core';
import { Subject } from 'rxjs';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideLabel?: boolean;
  hideRequiredMarker?: boolean;
  labelPosition?: 'floating';
}

@Component({
  selector: 'formly-wrapper-profile-field',
  styleUrls: ['./profile-field.wrapper.scss'],
  template: `
  <div class="border">
    <ng-template #labelTemplate>
      <label *ngIf="props.label && props.hideLabel !== true" [attr.for]="id" class="form-label">
        {{ props.label }}
        <span *ngIf="props.required && props.hideRequiredMarker !== true" aria-hidden="true">*</span>
      </label>
      </ng-template>
        <div class="mb-3" [class.form-floating]="props.labelPosition === 'floating'" [class.has-error]="showError">
          <ng-container *ngIf="props.labelPosition !== 'floating'">
            <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
          </ng-container>

          <ng-template #fieldComponent></ng-template>

          <ng-container *ngIf="props.labelPosition === 'floating'">
            <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
          </ng-container>

          <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
            <formly-validation-message [field]="field"></formly-validation-message>
          </div>

          <small *ngIf="props.description" class="form-text text-muted">{{ props.description }}</small>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormlyWrapperProfileField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {

  constructor() {
    super();
  }
}
