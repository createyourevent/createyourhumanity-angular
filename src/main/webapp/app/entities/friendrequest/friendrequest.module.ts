import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FriendrequestComponent } from './list/friendrequest.component';
import { FriendrequestDetailComponent } from './detail/friendrequest-detail.component';
import { FriendrequestUpdateComponent } from './update/friendrequest-update.component';
import { FriendrequestDeleteDialogComponent } from './delete/friendrequest-delete-dialog.component';
import { FriendrequestRoutingModule } from './route/friendrequest-routing.module';

@NgModule({
  imports: [SharedModule, FriendrequestRoutingModule],
  declarations: [FriendrequestComponent, FriendrequestDetailComponent, FriendrequestUpdateComponent, FriendrequestDeleteDialogComponent],
  entryComponents: [FriendrequestDeleteDialogComponent],
})
export class FriendrequestModule {}
