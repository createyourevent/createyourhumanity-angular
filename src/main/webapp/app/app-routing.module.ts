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
        {
          path: 'profile-view',
          loadChildren: () => import('./profile/profile-view/profile-view-page/profile-view-page.module').then(m => m.ProfileViewPageModule)
        },
        {
          path: 'search',
          loadChildren: () => import('./search/search-by-user/search-by-user.module').then(m => m.SearchByUserModule)
        },
        {
          path: 'search-profiles',
          loadChildren: () => import('./search/search-by-model-data/search-by-model-data-view/search-by-model-data-view.module').then(m => m.SearchByModelDataViewModule)
        },
        {
          path: 'groups',
          loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
        },
        {
          path: 'instructions',
          loadChildren: () => import('./instructions/instructions.module').then(m => m.InstructionsModule)
        },
        {
          path: 'settings',
          loadChildren: () => import('./account/settings/settings.module').then(m => m.SettingsModule)
        },

        /*
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
