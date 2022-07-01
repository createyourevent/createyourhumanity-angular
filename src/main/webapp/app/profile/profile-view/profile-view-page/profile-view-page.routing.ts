import { Routes, RouterModule } from '@angular/router';
import { ProfileViewPageComponent } from './profile-view-page.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileViewPageComponent,
  },
];

export const ProfileViewPageRoutes = RouterModule.forChild(routes);
