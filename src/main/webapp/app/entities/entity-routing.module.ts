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
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
