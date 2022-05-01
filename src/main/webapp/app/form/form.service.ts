import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormService {


  constructor(private cfr: ComponentFactoryResolver) {}

  async loadComponent(vcr: ViewContainerRef, xml: string, userId: string, mapId: string, id: string) {

    const { FormComponent } = await import('./form.component');
    const component : typeof FormComponent = FormComponent;

    const r = vcr.createComponent(this.cfr.resolveComponentFactory(component));
    r.instance.xml = xml;
    r.instance.userId = userId;
    r.instance.mapId = mapId;
    r.instance.id = id;
    return r;

  }
}
