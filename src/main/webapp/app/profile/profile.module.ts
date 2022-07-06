import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { TabViewModule } from 'primeng/tabview';
import ProfileHostDirective from './profile-host.directive';
import { SharedModule } from 'app/shared/shared.module';
import { CreateyourhumanityMindmapModule } from 'app/createyourhumanity-mindmap/createyourhumanity-mindmap.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProfileRoutes } from './profile.routing';
import { TreeProfileMenuModule } from 'app/tree-profile-menu/tree-profile-menu.module';

@NgModule({
  imports: [
    InputTextareaModule,
    CommonModule,
    TabViewModule,
    ProfileRoutes,
    SharedModule,
    CreateyourhumanityMindmapModule,
    TreeProfileMenuModule
  ],
  declarations: [ProfileComponent, ProfileHostDirective]
})
export class ProfileModule { }
