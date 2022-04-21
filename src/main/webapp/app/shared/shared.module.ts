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
import { ReactiveFormsModule } from '@angular/forms';
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

@NgModule({
  imports: [SharedLibsModule,
            ReactiveFormsModule,
            MatSliderModule,
            MatStepperModule,
            MatIconModule,
            MatTabsModule,
            FormlyModule.forRoot({
              wrappers: [
                { name: 'panel', component: PanelWrapperComponent },
              ],
              types: [
                { name: 'stepper', component: FormlyFieldStepperComponent, wrappers: [] },
                { name: 'tabs', component: FormlyFieldTabsComponent, wrappers: []  },
              ],
            }),
            FormlyBootstrapModule,
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
    FormlyFieldTabsComponent
  ],
  exports: [
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
