import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockerAppsComponent } from './docker-apps.component';
import { DockModule } from 'primeng/dock';

@NgModule({
  imports: [
    CommonModule,
    DockModule
  ],
  declarations: [DockerAppsComponent],
  exports: [DockerAppsComponent]
})
export class DockerAppsModule { }
