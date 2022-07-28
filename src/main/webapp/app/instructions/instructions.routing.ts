import { Routes, RouterModule } from '@angular/router';
import { InstructionsComponent } from './instructions.component';

const routes: Routes = [
  {
    path: '',
    component: InstructionsComponent,
    data: {
      pageTitle: 'instructions.title',
    },
   },
];

export const InstructionsRoutes = RouterModule.forChild(routes);
