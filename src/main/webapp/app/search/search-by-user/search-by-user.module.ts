import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchByUserComponent } from './search-by-user.component';
import { SearchByUserRoutes } from './search-by-user.routing'
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'app/shared/shared.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SearchByUserRoutes,
    DataViewModule,
    DropdownModule,
    ButtonModule
  ],
  declarations: [SearchByUserComponent]
})
export class SearchByUserModule {}
