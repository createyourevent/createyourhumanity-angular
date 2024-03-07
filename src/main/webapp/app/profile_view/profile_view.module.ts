import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabViewModule} from 'primeng/tabview';
import { FormModule } from 'app/form/form.module';
import { ProfileViewHostDirective } from './profile-view-host.directive';
import { ProfileViewComponent } from './profile_view.component';

@NgModule({
  imports: [
    CommonModule,
    TabViewModule,
    FormModule
  ],
  declarations: [ProfileViewComponent, ProfileViewHostDirective],
})
export class ProfileViewModule { }
