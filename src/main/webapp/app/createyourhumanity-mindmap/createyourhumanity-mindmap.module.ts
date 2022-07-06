import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { MindmapComponent } from 'app/mindmap/mindmap.component';
import { CreateyourhumanityMindmapComponent } from './createyourhumanity-mindmap.component';
import { CreateyourhumanityMindmapRoute } from './createyourhumanity-mindmap.routing';

@NgModule({
  imports: [SharedModule, CreateyourhumanityMindmapRoute],
  declarations: [CreateyourhumanityMindmapComponent],
  exports: [CreateyourhumanityMindmapComponent]
})
export class CreateyourhumanityMindmapModule {}
