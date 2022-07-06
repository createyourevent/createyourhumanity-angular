import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Designer } from '@wisemapping/mindplot';

@Injectable({
  providedIn: 'root'
})
export class DesignerGlobalService {

  private _designer: BehaviorSubject<Designer> = new BehaviorSubject<Designer>(null);

  getDesigner(): Observable<Designer> {
    return this._designer.asObservable();
  }

  setDesigner(designer: Designer) {
    this._designer.next(designer);
  }

}
