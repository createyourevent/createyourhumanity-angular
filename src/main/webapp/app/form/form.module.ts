import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { SharedModule } from 'app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { CreateyourhumanityMindmapModule } from 'app/createyourhumanity-mindmap/createyourhumanity-mindmap.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TabViewModule,
    CreateyourhumanityMindmapModule,
  ],
  declarations: [FormComponent]
})
export class FormModule { }
