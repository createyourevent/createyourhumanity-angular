import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FriendsComponent } from './list/friends.component';
import { FriendsDetailComponent } from './detail/friends-detail.component';
import { FriendsUpdateComponent } from './update/friends-update.component';
import { FriendsDeleteDialogComponent } from './delete/friends-delete-dialog.component';
import { FriendsRoutingModule } from './route/friends-routing.module';

@NgModule({
  imports: [SharedModule, FriendsRoutingModule],
  declarations: [FriendsComponent, FriendsDetailComponent, FriendsUpdateComponent, FriendsDeleteDialogComponent],
})
export class FriendsModule {}
