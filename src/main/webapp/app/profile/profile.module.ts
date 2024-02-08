import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import {TabViewModule} from 'primeng/tabview';
import { FormModule } from 'app/form/form.module';
import { ProfileRoutes } from './profile.routing';
import { ProfileHostDirective } from './profile-host.directive';

@NgModule({
  imports: [
    CommonModule,
    TabViewModule,
    FormModule,
    ProfileRoutes
  ],
  declarations: [ProfileComponent, ProfileHostDirective],
})
export class ProfileModule { }
