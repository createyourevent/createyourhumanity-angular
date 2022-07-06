import { NgModule } from '@angular/core';
import { CreateyourhumanityMindmapModule } from 'app/createyourhumanity-mindmap/createyourhumanity-mindmap.module';
import { MindmapProfileComponent } from 'app/mindmap-profile/mindmap-profile.component';
import { TabViewModule } from 'primeng/tabview';
import { SharedModule } from 'app/shared/shared.module';
import { CreateyourhumanityMindmapProfileComponent } from './createyourhumanity-mindmap-profile.component';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  imports: [SharedModule, CreateyourhumanityMindmapModule, TabViewModule, InputTextareaModule],
  declarations: [CreateyourhumanityMindmapProfileComponent, MindmapProfileComponent],
  exports: [CreateyourhumanityMindmapProfileComponent]
})
export class CreateyourhumanityMindmapProfileModule {}
