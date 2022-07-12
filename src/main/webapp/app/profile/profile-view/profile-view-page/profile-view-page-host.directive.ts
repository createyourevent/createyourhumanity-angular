import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[appProfileViewPageHost]' })
export class ProfileViewPageHostDirective {

  private _text = '';

  constructor(public viewContainerRef: ViewContainerRef) {}

  getText(): string {
    return this._text;
  }
}
export default ProfileViewPageHostDirective;
