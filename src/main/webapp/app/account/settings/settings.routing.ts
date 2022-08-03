import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: {
      pageTitle: 'account-settings.title',
    },
   },
];

export const SettingsRoutes = RouterModule.forChild(routes);
