import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'formly-field-rating',
  template: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RatingModule],
})
export class RatingComponent extends FieldType {
  value: number;
  updateRating(value: number): void {
    this.formControl.patchValue(value);
  }
}
