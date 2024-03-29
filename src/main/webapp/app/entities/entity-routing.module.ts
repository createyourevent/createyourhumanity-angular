import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'mindmap',
        data: { pageTitle: 'createyourhumanityAngularApp.mindmap.home.title' },
        loadChildren: () => import('./mindmap/mindmap.module').then(m => m.MindmapModule),
      },
      {
        path: 'formula-data',
        data: { pageTitle: 'createyourhumanityAngularApp.formulaData.home.title' },
        loadChildren: () => import('./formula-data/formula-data.module').then(m => m.FormulaDataModule),
      },
      {
        path: 'user-mindmap',
        data: { pageTitle: 'createyourhumanityAngularApp.userMindmap.home.title' },
        loadChildren: () => import('./user-mindmap/user-mindmap.module').then(m => m.UserMindmapModule),
      },
      {
        path: 'key-table',
        data: { pageTitle: 'createyourhumanityAngularApp.keyTable.home.title' },
        loadChildren: () => import('./key-table/key-table.module').then(m => m.KeyTableModule),
      },
      {
        path: 'user-details',
        data: { pageTitle: 'createyourhumanityAngularApp.userDetails.home.title' },
        loadChildren: () => import('./user-details/user-details.module').then(m => m.UserDetailsModule),
      },
      {
        path: 'friends',
        data: { pageTitle: 'createyourhumanityAngularApp.friends.home.title' },
        loadChildren: () => import('./friends/friends.module').then(m => m.FriendsModule),
      },
      {
        path: 'friendrequest',
        data: { pageTitle: 'createyourhumanityAngularApp.friendrequest.home.title' },
        loadChildren: () => import('./friendrequest/friendrequest.module').then(m => m.FriendrequestModule),
      },
      {
        path: 'grants-level',
        data: { pageTitle: 'createyourhumanityAngularApp.grantsLevel.home.title' },
        loadChildren: () => import('./grants-level/grants-level.module').then(m => m.GrantsLevelModule),
      },
      {
        path: 'visibility-status',
        data: { pageTitle: 'createyourhumanityAngularApp.visibilityStatus.home.title' },
        loadChildren: () => import('./visibility-status/visibility-status.module').then(m => m.VisibilityStatusModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
