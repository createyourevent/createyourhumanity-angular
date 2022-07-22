import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchByModelDataViewComponent } from './search-by-model-data-view.component';
import { SharedModule } from 'app/shared/shared.module';
import { EditorModule } from 'primeng/editor';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import SearchByModelDataViewDirective from './search-by-model-data-view.directive';
import { SearchByModelDataViewRoutes } from './search-by-model-data-view.routing';
import { SearchByModelDataComponent } from '../search-by-model-data.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InputTextareaModule,
    CommonModule,
    TabViewModule,
    EditorModule,
    TableModule,
    SearchByModelDataViewRoutes,
  ],
  declarations: [SearchByModelDataViewComponent, SearchByModelDataViewDirective, SearchByModelDataComponent],
  exports: [SearchByModelDataViewComponent, SearchByModelDataViewDirective]
})
export class SearchByModelDataViewModule {}
