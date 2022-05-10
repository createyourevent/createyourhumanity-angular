import { Routes, RouterModule } from '@angular/router';
import { FriendlistComponent } from './friendlist.component';

const routes: Routes = [
  {
    path: '',
    component: FriendlistComponent,
    data: {
      pageTitle: 'friendlist.title',
    },
  },
];

export const FriendlistRoutes = RouterModule.forChild(routes);
