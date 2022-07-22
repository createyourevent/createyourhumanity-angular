import { Routes, RouterModule } from '@angular/router';
import { SearchByModelDataViewComponent } from './search-by-model-data-view.component';

const routes: Routes = [
  {
    path: '',
    component: SearchByModelDataViewComponent,
    data: {
      pageTitle: 'search.search',
    },
   },
];

export const SearchByModelDataViewRoutes = RouterModule.forChild(routes);
