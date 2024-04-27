import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserMindmapComponent } from './list/user-mindmap.component';
import { UserMindmapDetailComponent } from './detail/user-mindmap-detail.component';
import { UserMindmapUpdateComponent } from './update/user-mindmap-update.component';
import { UserMindmapDeleteDialogComponent } from './delete/user-mindmap-delete-dialog.component';
import { UserMindmapRoutingModule } from './route/user-mindmap-routing.module';

@NgModule({
  imports: [SharedModule, UserMindmapRoutingModule],
  declarations: [UserMindmapComponent, UserMindmapDetailComponent, UserMindmapUpdateComponent, UserMindmapDeleteDialogComponent],
})
export class UserMindmapModule {}
