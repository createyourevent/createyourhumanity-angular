import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MindmapRoutingResolveService } from 'app/entities/mindmap/route/mindmap-routing-resolve.service';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: 'profile_view/:profileId',
    component: ProfileComponent,
  },
];

export const ProfileRoutes = RouterModule.forChild(routes);
