import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[appProfileViewPageHost]' })
export class ProfileViewPageHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
export default ProfileViewPageHostDirective;
