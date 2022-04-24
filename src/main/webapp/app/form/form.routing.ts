import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form.component';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    data: {
      pageTitle: 'form.title',
    },
   },
];

export const FormRoutes = RouterModule.forChild(routes);
