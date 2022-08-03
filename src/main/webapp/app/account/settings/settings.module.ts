import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsRoutes } from './settings.routing';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutes,
    GooglePlaceModule
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule { }
