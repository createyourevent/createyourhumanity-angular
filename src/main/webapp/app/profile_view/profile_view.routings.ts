import { Routes, RouterModule } from '@angular/router';
import { ProfileViewComponent } from './profile_view.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileViewComponent,
  },
];

export const ProfileViewRoutes = RouterModule.forChild(routes);
