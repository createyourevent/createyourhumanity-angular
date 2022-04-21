import { RouterModule, Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { CreateyourhumanityMindmapComponent } from './createyourhumanity-mindmap.component';

const CREATEYOURHUMANITY_MINDMAP_ROUTE: Route = {
    path: 'createyourhumanity-mindmap',
    component: CreateyourhumanityMindmapComponent,
    data: {
      pageTitle: 'home.title',
      authorities: [Authority.USER],
    }
  };

export const CreateyourhumanityMindmapRoute = RouterModule.forChild([CREATEYOURHUMANITY_MINDMAP_ROUTE]);
