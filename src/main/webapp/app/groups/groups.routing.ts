import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    data: {
      pageTitle: 'groups.title',
    }, },
];

export const GroupsRoutes = RouterModule.forChild(routes);
