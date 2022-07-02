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
import { FormlyFieldTimeComponent } from 'app/formly/formly-field-time.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TagInputModule } from 'ngx-chips';
import { FormlyFieldKeywordsComponent } from 'app/formly/formly-field-keywords.component';
import { QuillModule } from 'ngx-quill';
import { FormlyFieldEditorComponent } from 'app/formly/formly-field-editor.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { FormlyFieldAddressComponent } from 'app/formly/formly-field-address.component';
import { FormlyFieldKeywordsListComponent } from 'app/formly/formly-field-keywords-list.component';
import { TextfieldSummaryComponent } from 'app/formly/summary/textfield-summary/textfield-summary.component';
import { FormlyWrapperGrantField } from 'app/formly/grant-field/src/grant-field.wrapper';
import { NgSelectModule } from '@ng-select/ng-select';
import { TextareaSummaryComponent } from 'app/formly/summary/textarea-summary/textarea-summary.component';
import { RadiogroupSummaryComponent } from 'app/formly/summary/radiogroup-summary/radiogroup-summary.component';
import { EditorSummaryComponent } from 'app/formly/summary/editor-summary/editor-summary.component';
import { SafeHtmlPipe } from 'app/pipes/safeHtml.pipe';
import { TimeSummaryComponent } from 'app/formly/summary/time-summary/time-summary.component';
import { AddressSummaryComponent } from 'app/formly/summary/address-summary/address-summary.component';
import { KeywordsSummaryComponent } from 'app/formly/summary/keywords-summary/keywords-summary.component';
import { SelectSummaryComponent } from 'app/formly/summary/select-summary/select-summary.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldRatingsComponent } from 'app/formly/ratings/formly-field-ratings.component';
import { RatingSummaryComponent } from 'app/formly/summary/rating-summary/rating-summary.component';
import { MulticheckboxSummaryComponent } from 'app/formly/summary/multicheckbox-summary/multicheckbox-summary.component';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyFieldMultiselectComponent } from 'app/formly/multiselect/formly-field-multiselect.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { MultiselectSummaryComponent } from 'app/formly/summary/multiselect-summary/multiselect-summary.component';
import { FormlyWrapperProfileField } from 'app/formly/profile-field/profile-field.wrapper';
import { MatExpansionModule } from '@angular/material/expansion';
import { ExpansionPanelComponent } from 'app/formly/expansion-panel.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [SharedLibsModule,
            MultiSelectModule,
            MatSelectModule,
            FormlySelectModule,
            NgbModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            MatSliderModule,
            MatStepperModule,
            MatIconModule,
            MatTabsModule,
            MatExpansionModule,
            NgxMaterialTimepickerModule,
            TagInputModule,
            GooglePlaceModule,
            QuillModule.forRoot(),
            FormlyBootstrapModule,
            FormlyModule.forRoot({
              wrappers: [
                { name: 'panel', component: PanelWrapperComponent },
                { name: 'container-wrapper', component: ContainerWrapperComponent },
                { name: 'rowwrapper', component: RowWrapperComponent },
                { name: 'columnwrapper', component: ColumnWrapperComponent },
                { name: 'grant-field', component: FormlyWrapperGrantField },
                { name: 'profile-field', component: FormlyWrapperProfileField },
                { name: 'expansion', component: ExpansionPanelComponent },
              ],
              types: [
                { name: 'stepper', component: FormlyFieldStepperComponent, wrappers: [] },
                { name: 'tabs', component: FormlyFieldTabsComponent, wrappers: [] },
                { name: 'container', component: ContainerComponent },
                { name: 'row', component: RowComponent },
                { name: 'column', component: ColumnComponent },
                { name: 'date', component: DateInputComponent, wrappers: ['form-field'] },
                { name: 'datetime', component: DateTimeInputComponent, wrappers: ['form-field'] },
                { name: 'time', component: FormlyFieldTimeComponent, wrappers: ['form-field'] },
                { name: 'keywords', component: FormlyFieldKeywordsComponent, wrappers: ['form-field'] },
                { name: 'keywords-list', component: FormlyFieldKeywordsListComponent, wrappers: ['form-field'] },
                { name: 'editor', component: FormlyFieldEditorComponent, wrappers: ['form-field'] },
                { name: 'address', component: FormlyFieldAddressComponent, wrappers: ['form-field'] },
                { name: 'textfield-summary', component: TextfieldSummaryComponent },
                { name: 'textarea-summary', component: TextareaSummaryComponent },
                { name: 'radiogroup-summary', component: RadiogroupSummaryComponent },
                { name: 'editor-summary', component: EditorSummaryComponent },
                { name: 'time-summary', component: TimeSummaryComponent },
                { name: 'address-summary', component: AddressSummaryComponent },
                { name: 'keywords-summary', component:  KeywordsSummaryComponent },
                { name: 'select-summary', component:  SelectSummaryComponent },
                { name: 'rating', component:  FormlyFieldRatingsComponent },
                { name: 'rating-summary', component:  RatingSummaryComponent },
                { name: 'multicheckbox-summary', component:  MulticheckboxSummaryComponent },
                { name: 'multiselect', component:   FormlyFieldMultiselectComponent },
                { name: 'multiselect-summary', component: MultiselectSummaryComponent },
              ],
            }),
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
    ColumnComponent,
    DateInputComponent,
    DateTimeInputComponent,
    FormlyFieldTimeComponent,
    FormlyFieldKeywordsComponent,
    FormlyFieldAddressComponent,
    FormlyFieldEditorComponent,
    FormlyFieldKeywordsListComponent,
    TextfieldSummaryComponent,
    FormlyWrapperGrantField,
    TextareaSummaryComponent,
    RadiogroupSummaryComponent,
    EditorSummaryComponent,
    SafeHtmlPipe,
    AddressSummaryComponent,
    KeywordsSummaryComponent,
    SelectSummaryComponent,
    FormlyFieldRatingsComponent,
    RatingSummaryComponent,
    MulticheckboxSummaryComponent,
    FormlyFieldMultiselectComponent,
    MultiselectSummaryComponent,
    FormlyWrapperProfileField,
    ExpansionPanelComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
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
    FormlyModule,
    FormlyBootstrapModule,
    XmlPipe,
    MatSliderModule,
    MatStepperModule,
    MatIconModule,
    MatTabsModule,
    FormlyFieldTimeComponent,
    FormlyFieldKeywordsComponent,
    ContainerComponent,
    FormlyFieldAddressComponent,
    FormlyFieldEditorComponent,
    FormlyFieldKeywordsListComponent,
    FormlyWrapperGrantField,
    TextareaSummaryComponent,
    RadiogroupSummaryComponent,
    EditorSummaryComponent,
    SafeHtmlPipe,
    AddressSummaryComponent,
    KeywordsSummaryComponent,
    SelectSummaryComponent,
    FormlyFieldRatingsComponent,
    RatingSummaryComponent,
    MulticheckboxSummaryComponent,
    FormlyFieldMultiselectComponent,
    MultiselectSummaryComponent,
    FormlyWrapperProfileField,
    MatExpansionModule,
    MatSelectModule
  ],
})
export class SharedModule {}
