import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'jhi-docker-apps',
  templateUrl: './docker-apps.component.html',
  styleUrls: ['./docker-apps.component.scss']
})
export class DockerAppsComponent implements OnInit {

  dockItems: MenuItem[];

  ngOnInit() {
    this.dockItems = [
      {
          label: 'MMMM - Heartfull Mind',
          tooltipOptions: {
              tooltipLabel: "MMMM - Heartfull Mind",
              tooltipPosition: 'top',
              positionTop: -15,
              positionLeft: 15
          },
          icon: "../content/images/dock-apps/logo_heartfullmind_60.png",
          command: () => {
            window.open('https://www.heartfull-mind.space');
          }
      },
      {
        label: 'Create Your Humanity',
        tooltipOptions: {
            tooltipLabel: "Create Your Humanity",
            tooltipPosition: 'top',
            positionTop: -15,
            positionLeft: 15
        },
        icon: "../content/images/dock-apps/logo_createyourhumanity_60.png",
        command: () => {
          window.open('https://www.createyourhumanity.org');
        }
      },
      {
        label: 'Create Your Ideas',
        tooltipOptions: {
            tooltipLabel: "Create Your Ideas",
            tooltipPosition: 'top',
            positionTop: -15,
            positionLeft: 15
        },
        icon: "../content/images/dock-apps/logo_createyourideas_60.png",
        command: () => {
          window.open('https://www.createyourideas.net');
        }
    },
    {
      label: 'Create Your Event',
      tooltipOptions: {
          tooltipLabel: "Create Your Event",
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15
      },
      icon: "../content/images/dock-apps/logo_createyourevent_60.png",
      command: () => {
        window.open('https://www.createyourevent.org');
      }
    }
  ];
  }

}
