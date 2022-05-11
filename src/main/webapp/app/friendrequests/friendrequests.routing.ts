import { Routes, RouterModule } from '@angular/router';
import { FriendrequestsComponent } from './friendrequests.component';

const routes: Routes = [
  {
    path: '',
    component: FriendrequestsComponent,
    data: {
      pageTitle: 'friendrequests.title',
    },
   },
];

export const FriendrequestsRoutes = RouterModule.forChild(routes);
