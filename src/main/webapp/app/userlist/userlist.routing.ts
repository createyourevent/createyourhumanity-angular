import { Routes, RouterModule } from '@angular/router';
import { UserlistComponent } from './userlist.component';

const routes: Routes = [
  {
    path: '',
    component: UserlistComponent,
    data: {
      pageTitle: 'home.title',
    },
  },
];

export const UserlistRoutes = RouterModule.forChild(routes);
