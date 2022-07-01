import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { TabViewModule } from 'primeng/tabview';
import { ProfileRoutes } from './profile.routing';
import ProfileHostDirective from './profile-host.directive';
import { SharedModule } from 'app/shared/shared.module';
import { CreateyourhumanityMindmapModule } from 'app/createyourhumanity-mindmap/createyourhumanity-mindmap.module';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  imports: [
    InputTextareaModule,
    CommonModule,
    TabViewModule,
    ProfileRoutes,
    SharedModule,
    CreateyourhumanityMindmapModule
  ],
  declarations: [ProfileComponent, ProfileHostDirective]
})
export class ProfileModule { }
