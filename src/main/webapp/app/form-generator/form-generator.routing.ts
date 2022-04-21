import { Routes, RouterModule } from '@angular/router';
import { FormGeneratorComponent } from './form-generator.component';

const routes: Routes = [
  {
    path: '',
    component: FormGeneratorComponent,
    data: {
      pageTitle: 'form-generator.title',
    },
   },
];

export const FormGeneratorRoutes = RouterModule.forChild(routes);
