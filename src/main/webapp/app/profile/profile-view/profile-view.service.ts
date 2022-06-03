import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfileViewPageService {

  async loadComponent(vcr: ViewContainerRef, xml: string, userId: string, mapId: string, id: string) {

    const { ProfileViewComponent } = await import('./profile-view.component');
    const component : typeof ProfileViewComponent = ProfileViewComponent;

    const r = vcr.createComponent(component);
    r.instance.xml = xml;
    r.instance.userId = userId;
    r.instance.mapId = mapId;
    r.instance.id = id;
    return r;

  }
}
