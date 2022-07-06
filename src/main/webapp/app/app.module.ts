import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/en';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgxWebstorageModule } from 'ngx-webstorage';
import dayjs from 'dayjs/esm';
import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';
import { SharedModule } from 'app/shared/shared.module';
import { TranslationModule } from 'app/shared/language/translation.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { CreateyourhumanityMindmapModule } from './createyourhumanity-mindmap/createyourhumanity-mindmap.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateyourhumanityMindmapProfileModule } from './createyourhumanity-mindmap-profile/createyourhumanity-mindmap-profile.module';
import { DockerAppsModule } from './docker-apps/docker-apps.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule } from './form/form.module';
import { ProfileViewModule } from './profile/profile-view/profile-view.module';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { DesignerGlobalService } from './designer-global.service';
import { ProfileComponent } from './profile/profile.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { ProfileRoutes } from './profile/profile.routing';
import { TreeProfileMenuModule } from './tree-profile-menu/tree-profile-menu.module';
import { CalculatePercentOfProfileModule } from './views/calculate-percent-of-profile/calculate-percent-of-profile.module';

@NgModule({
  imports: [
    InputTextareaModule,
    CommonModule,
    TabViewModule,
    SharedModule,
    CreateyourhumanityMindmapModule,
    TreeProfileMenuModule,
    CalculatePercentOfProfileModule,
    FormsModule,
    ReactiveFormsModule,
    CreateyourhumanityMindmapModule,
    SharedModule,
    FormModule,
    ProfileViewModule,
    CreateyourhumanityMindmapModule,
    CreateyourhumanityMindmapProfileModule,
    DockerAppsModule,
    BrowserModule,
    BrowserAnimationsModule,
    TreeModule,
    ContextMenuModule,
    ToastModule,
    ButtonModule,
    DialogModule,
    HomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
    TranslationModule,
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'de' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
    DesignerGlobalService,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent, ProfileComponent],
  bootstrap: [MainComponent],
})
export class AppModule {
  constructor(applicationConfigService: ApplicationConfigService, iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }
}
