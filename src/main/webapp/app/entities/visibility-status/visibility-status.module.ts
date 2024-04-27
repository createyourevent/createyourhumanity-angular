import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VisibilityStatusComponent } from './list/visibility-status.component';
import { VisibilityStatusDetailComponent } from './detail/visibility-status-detail.component';
import { VisibilityStatusUpdateComponent } from './update/visibility-status-update.component';
import { VisibilityStatusDeleteDialogComponent } from './delete/visibility-status-delete-dialog.component';
import { VisibilityStatusRoutingModule } from './route/visibility-status-routing.module';

@NgModule({
  imports: [SharedModule, VisibilityStatusRoutingModule],
  declarations: [
    VisibilityStatusComponent,
    VisibilityStatusDetailComponent,
    VisibilityStatusUpdateComponent,
    VisibilityStatusDeleteDialogComponent,
  ],
})
export class VisibilityStatusModule {}
