import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileViewPageComponent } from './profile-view-page.component';
import { TabViewModule } from 'primeng/tabview';
import ProfileViewPageHostDirective from './profile-view-page-host.directive';
import { SharedModule } from 'app/shared/shared.module';
import { CreateyourhumanityMindmapModule } from 'app/createyourhumanity-mindmap/createyourhumanity-mindmap.module';
import { ProfileViewPageRoutes } from './profile-view-page.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TabViewModule,
    ProfileViewPageRoutes,
    CreateyourhumanityMindmapModule
  ],
  declarations: [ProfileViewPageComponent, ProfileViewPageHostDirective]
})
export class ProfileViewPageModule { }
