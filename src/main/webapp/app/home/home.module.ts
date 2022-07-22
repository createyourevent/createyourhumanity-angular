import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { ButtonModule } from 'primeng/button';
import { MindmapHomeComponent } from './mindmap-home/mindmap-home.component';
import { MindmapStartComponent } from './mindmap-home/mindmap/mindmap.component';
import { UserBoxSliderModule } from 'app/views/user-box-slider/user-box-slider.module';

@NgModule({
  imports: [SharedModule,
            RouterModule.forChild([HOME_ROUTE]),
            ButtonModule,
            UserBoxSliderModule
            ],
  declarations: [HomeComponent, MindmapHomeComponent, MindmapStartComponent],
  exports: [MindmapHomeComponent]
})
export class HomeModule {}
