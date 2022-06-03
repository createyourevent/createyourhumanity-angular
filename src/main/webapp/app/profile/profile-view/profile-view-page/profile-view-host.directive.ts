import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[appProfileViewHost]' })
export class ProfileViewHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
export default ProfileViewHostDirective;
