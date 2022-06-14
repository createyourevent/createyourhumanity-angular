import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MindmapProfileComponent } from 'app/mindmap-profile/mindmap-profile.component';

import { SharedModule } from 'app/shared/shared.module';
import { CreateyourhumanityMindmapProfileComponent } from './createyourhumanity-mindmap-profile.component';
import { CreateyourhumanityMindmapProfileRoute } from './createyourhumanity-mindmap-profile.routing';

@NgModule({
  imports: [SharedModule, CreateyourhumanityMindmapProfileRoute],
  declarations: [CreateyourhumanityMindmapProfileComponent, MindmapProfileComponent],
})
export class CreateyourhumanityMindmapProfileModule {}
