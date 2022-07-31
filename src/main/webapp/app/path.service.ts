import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  public path = new Subject<number>();

  setPath(path: number) {
    this.path.next(path);
  }

}
