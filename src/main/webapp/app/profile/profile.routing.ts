import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    data: {
      pageTitle: 'profile.title',
    },
   },
];

export const ProfileRoutes = RouterModule.forChild(routes);
