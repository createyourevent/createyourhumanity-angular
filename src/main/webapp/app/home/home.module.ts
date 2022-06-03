import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [SharedModule,
            RouterModule.forChild([HOME_ROUTE]),
            ButtonModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
