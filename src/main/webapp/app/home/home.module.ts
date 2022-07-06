import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { ButtonModule } from 'primeng/button';
import { MindmapHomeComponent } from './mindmap-home/mindmap-home.component';
import { MindmapStartComponent } from './mindmap-home/mindmap/mindmap.component';

@NgModule({
  imports: [SharedModule,
            RouterModule.forChild([HOME_ROUTE]),
            ButtonModule,
            ],
  declarations: [HomeComponent, MindmapHomeComponent, MindmapStartComponent],
})
export class HomeModule {}
