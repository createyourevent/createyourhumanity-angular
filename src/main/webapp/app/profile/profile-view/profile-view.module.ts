import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { CreateyourhumanityMindmapModule } from 'app/createyourhumanity-mindmap/createyourhumanity-mindmap.module';
import { ProfileViewComponent } from './profile-view.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TabViewModule,
    CreateyourhumanityMindmapModule,
  ],
  declarations: [ProfileViewComponent]
})
export class ProfileViewModule { }
