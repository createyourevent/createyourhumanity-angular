import { Routes, RouterModule } from '@angular/router';
import { SearchByUserComponent } from './search-by-user.component';

const routes: Routes = [
  {
    path: '',
    component: SearchByUserComponent
   },
];

export const SearchByUserRoutes = RouterModule.forChild(routes);
