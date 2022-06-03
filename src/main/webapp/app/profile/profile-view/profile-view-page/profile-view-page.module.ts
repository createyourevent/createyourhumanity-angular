import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabViewModule} from 'primeng/tabview';
import { ProfileRoutes } from './profile-view-page.routing';
import ProfileViewHostDirective from './profile-view-host.directive';
import { ProfileViewPageComponent } from './profile-view-page.component';
import { SharedModule } from 'app/shared/shared.module';
import { ProfileViewModule } from '../profile-view.module';

@NgModule({
  imports: [
    CommonModule,
    TabViewModule,
    ProfileViewModule,
    ProfileRoutes,
    SharedModule
  ],
  declarations: [ProfileViewPageComponent, ProfileViewHostDirective]
})
export class ProfileViewPageModule { }
