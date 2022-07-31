import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { PathService } from 'app/path.service';

@Component({
  selector: 'jhi-formly-field-stepper',
  template: `
  <mat-horizontal-stepper #matHorizontalStepper [selectedIndex]="selectedIndex">
    <mat-step [id]="id_link" *ngFor="let step of field.fieldGroup; let index = index; let last = last;">
      <ng-template matStepLabel>{{ step.templateOptions.label }}&nbsp;<ng-container *ngFor="let r of rels"><ng-container *ngIf="r.label === step.templateOptions.label"><button class="path-button" (click)="setPath($event, r.dest)">{{ 'profile.button' | translate }}</button></ng-container></ng-container></ng-template>
      <formly-field [field]="step"></formly-field>

      <div>
        <button matStepperPrevious *ngIf="index !== 0"
          class="btn btn-primary"
          type="button">
          Back
        </button>

        <button matStepperNext *ngIf="!last"
          class="btn btn-primary" type="button"
          [disabled]="!isValid(step)">
          Next
        </button>
      </div>
    </mat-step>
  </mat-horizontal-stepper>
`,
})
export class FormlyFieldStepperComponent extends FieldType implements OnInit, AfterViewInit {

  @ViewChild('matHorizontalStepper') stepper: MatStepper;

  id_link: string;
  index: number;
  currentStep: number;
  relations:any[] = [];
  rels: any[] = [];


  constructor(private pathService: PathService) {
    super();
  }

  ngOnInit(): void {
    this.id_link = this.field.id;
    this.relations = this.field.templateOptions.relations;
    this.rels = this.field.templateOptions.rels;
  }

  ngAfterViewInit(): void {
    if(Number(this.field.selectedIndex) >= 0) {
      this.setStep(Number(this.field.selectedIndex));
    }
  }

  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup
      ? field.fieldGroup.every((f) => this.isValid(f))
      : true;
  }

  setStep(index: number) {
    this.setStepper(index);
  }

  public setStepper(index: number): void {
    this.stepper.linear = false
    this.currentStep = index;
    while (this.stepper.selectedIndex < this.currentStep) {
        this.stepper.selectedIndex = this.stepper.selectedIndex + 1;
    }
    this.stepper.selectedIndex = this.currentStep;
    setTimeout(() => {
        this.stepper.linear = true;
    });
  }

  setPath(event: any, path: string) {
    this.pathService.setPath(Number(path));
    event.stopPropagation();
  }

}
