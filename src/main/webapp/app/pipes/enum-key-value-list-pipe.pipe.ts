import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumKeyValueListPipe'
})
export class EnumKeyValueListPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
