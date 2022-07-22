import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { SharedModule } from 'app/shared/shared.module';
import { CreateyourhumanityMindmapModule } from 'app/createyourhumanity-mindmap/createyourhumanity-mindmap.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProfileRoutes } from './profile.routing';
import { TreeProfileMenuModule } from 'app/tree-profile-menu/tree-profile-menu.module';
import { CalculatePercentOfProfileModule } from 'app/views/calculate-percent-of-profile/calculate-percent-of-profile.module';
import { EditorModule } from 'primeng/editor';

@NgModule({
  imports: [
    SharedModule,
    InputTextareaModule,
    CommonModule,
    TabViewModule,
    EditorModule,
    ProfileRoutes,
    CreateyourhumanityMindmapModule,
    TreeProfileMenuModule,
    CalculatePercentOfProfileModule
  ],
})
export class ProfileModule { }
