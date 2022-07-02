import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileViewPageComponent } from './profile-view-page.component';
import { TabViewModule } from 'primeng/tabview';
import ProfileViewPageHostDirective from './profile-view-page-host.directive';
import { SharedModule } from 'app/shared/shared.module';
import { ProfileViewPageRoutes } from './profile-view-page.routing';
import { CreateyourhumanityMindmapProfileModule } from 'app/createyourhumanity-mindmap-profile/createyourhumanity-mindmap-profile.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TabViewModule,
    ProfileViewPageRoutes,
    CreateyourhumanityMindmapProfileModule
  ],
  declarations: [ProfileViewPageComponent, ProfileViewPageHostDirective]
})
export class ProfileViewPageModule { }
