import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MindmapProfileComponent } from 'app/mindmap-profile/mindmap-profile.component';

import { SharedModule } from 'app/shared/shared.module';
import { CreateyourhumanityMindmapProfileComponent } from './createyourhumanity-mindmap-profile.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CreateyourhumanityMindmapProfileComponent, MindmapProfileComponent],
  exports: [CreateyourhumanityMindmapProfileComponent]
})
export class CreateyourhumanityMindmapProfileModule {}
