import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'friendlist',
          loadChildren: () => import(`./account/friendlist/friendlist.module`).then(m => m.FriendlistModule),
        },
        {
          path: 'userlist',
          loadChildren: () => import(`./userlist/userlist.module`).then(m => m.UserlistModule),
        },
        {
          path: 'profile',
          loadChildren: () => import(`./profile/profile.module`).then(m => m.ProfileModule),
        },
        {
          path: 'requests',
          loadChildren: () => import(`./friendrequests/friendrequests.module`).then(m => m.FriendrequestsModule),
        },
        /*
        {
          path: 'createyourhumanity-mindmap',
          loadChildren: () => import(`./createyourhumanity-mindmap/createyourhumanity-mindmap.module`).then(m => m.CreateyourhumanityMindmapModule),
        },
        {
          path: 'form-generator',
          loadChildren: () => import(`./form-generator/form-generator.module`).then(m => m.FormGeneratorModule),
        },
        */
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
