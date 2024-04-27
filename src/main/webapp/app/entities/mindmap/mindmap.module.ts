import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MindmapComponent } from './list/mindmap.component';
import { MindmapDetailComponent } from './detail/mindmap-detail.component';
import { MindmapUpdateComponent } from './update/mindmap-update.component';
import { MindmapDeleteDialogComponent } from './delete/mindmap-delete-dialog.component';
import { MindmapRoutingModule } from './route/mindmap-routing.module';

@NgModule({
  imports: [SharedModule, MindmapRoutingModule],
  declarations: [MindmapComponent, MindmapDetailComponent, MindmapUpdateComponent, MindmapDeleteDialogComponent],
})
export class MindmapModule {}
