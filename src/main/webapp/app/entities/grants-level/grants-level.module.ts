import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GrantsLevelComponent } from './list/grants-level.component';
import { GrantsLevelDetailComponent } from './detail/grants-level-detail.component';
import { GrantsLevelUpdateComponent } from './update/grants-level-update.component';
import { GrantsLevelDeleteDialogComponent } from './delete/grants-level-delete-dialog.component';
import { GrantsLevelRoutingModule } from './route/grants-level-routing.module';

@NgModule({
  imports: [SharedModule, GrantsLevelRoutingModule],
  declarations: [GrantsLevelComponent, GrantsLevelDetailComponent, GrantsLevelUpdateComponent, GrantsLevelDeleteDialogComponent],
  entryComponents: [GrantsLevelDeleteDialogComponent],
})
export class GrantsLevelModule {}
