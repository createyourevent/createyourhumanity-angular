import { NgModule } from '@angular/core';
import {TabViewModule} from 'primeng/tabview';
import { CommonModule } from '@angular/common';
import { ProfileViewHostDirective } from './profile-view-host.directive';
import { ProfileViewRoutes } from './profile_view.routings';
import { ProfileViewComponent } from './profile_view.component';

@NgModule({
  imports: [
    CommonModule,
    TabViewModule,
    ProfileViewRoutes
  ],
  declarations: [ProfileViewComponent, ProfileViewHostDirective],
})
export class ProfileViewModule { }
