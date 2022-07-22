import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[searchByModelDataViewHost]' })
export class SearchByModelDataViewDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
export default SearchByModelDataViewDirective;
