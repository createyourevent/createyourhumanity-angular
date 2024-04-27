import { NgModule } from '@angular/core';
import { SharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { TranslateDirective } from './language/translate.directive';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { DurationPipe } from './date/duration.pipe';
import { FormatMediumDatetimePipe } from './date/format-medium-datetime.pipe';
import { FormatMediumDatePipe } from './date/format-medium-date.pipe';
import { SortByDirective } from './sort/sort-by.directive';
import { SortDirective } from './sort/sort.directive';
import { ItemCountComponent } from './pagination/item-count.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { XmlPipe } from 'app/pipes/xmlpipe.pipe';
import { PanelWrapperComponent } from 'app/formly/panel-wrapper.component';
import { FormlyFieldStepperComponent } from 'app/formly/stepper.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { FormlyFieldTabsComponent } from 'app/formly/tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ColumnComponent } from 'app/formly/column.component';
import { RowComponent } from 'app/formly/row.component';
import { ContainerWrapperComponent } from 'app/formly/container-wrapper.component';
import { ContainerComponent } from 'app/formly/container.component';
import { ColumnWrapperComponent } from 'app/formly/column-wrapper.component';
import { RowWrapperComponent } from 'app/formly/row-wrapper.component';
import { DateTimeInputComponent } from 'app/formly/date-time.component';
import { DateInputComponent } from 'app/formly/date.component';
import { FormlyGrantsComponent } from 'app/formly/grant_controller.component';
import { CommonModule } from '@angular/common';
import { ExpansionPanelWrapperComponent } from 'app/formly/expansionpanel.component';
import { DropdownModule } from 'primeng/dropdown';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [FormsModule,
            ReactiveFormsModule,
            FormlyModule.forRoot({
              wrappers: [
                { name: 'panel', component: PanelWrapperComponent },
                { name: 'containerwrapper', component: ContainerWrapperComponent },
                { name: 'rowwrapper', component: RowWrapperComponent },
                { name: 'columnwrapper', component: ColumnWrapperComponent },
                { name: 'grants', component: FormlyGrantsComponent  },
                { name: 'expansion', component: ExpansionPanelWrapperComponent  },
              ],
              types: [
                { name: 'stepper', component: FormlyFieldStepperComponent, wrappers: [] },
                { name: 'tabs', component: FormlyFieldTabsComponent, wrappers: [] },
                { name: 'container', component: ContainerComponent },
                { name: 'row', component: RowComponent },
                { name: 'column', component: ColumnComponent },
                { name: 'date', component: DateInputComponent, wrappers: ['form-field'] },
                { name: 'datetime', component: DateTimeInputComponent, wrappers: ['form-field'] },
              ],
            }),
            FormlyBootstrapModule,
            CommonModule,
            DropdownModule,
            MatSliderModule,
            MatStepperModule,
            MatSelectModule,
            MatIconModule,
            FormsModule,
            MatTabsModule,
            FormlyBootstrapModule,
            NgbModule
  ],
  declarations: [
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    XmlPipe,
    FormlyFieldStepperComponent,
    FormlyFieldTabsComponent,
    ContainerComponent,
    RowComponent,
    FormlyGrantsComponent,
    ColumnComponent,
    DateInputComponent,
    DateTimeInputComponent
  ],
  exports: [
    CommonModule,
    SharedLibsModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    FormlyGrantsComponent,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    XmlPipe,
    MatSliderModule,
    MatStepperModule,
    MatIconModule,
    MatTabsModule
  ],
})
export class SharedModule {}
