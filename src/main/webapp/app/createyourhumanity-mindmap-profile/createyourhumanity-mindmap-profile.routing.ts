import { RouterModule, Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { CreateyourhumanityMindmapProfileComponent } from './createyourhumanity-mindmap-profile.component';

const CREATEYOURHUMANITY_MINDMAP_PROFILE_ROUTE: Route = {
    path: 'mindmap-profile',
    component: CreateyourhumanityMindmapProfileComponent,
    data: {
      pageTitle: 'home.title',
      authorities: [Authority.USER],
    }
  };

export const CreateyourhumanityMindmapProfileRoute = RouterModule.forChild([CREATEYOURHUMANITY_MINDMAP_PROFILE_ROUTE]);
