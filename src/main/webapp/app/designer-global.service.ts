import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Designer } from '@wisemapping/mindplot';

@Injectable({
  providedIn: 'root'
})
export class DesignerGlobalService {

  private _designer: BehaviorSubject<Designer> = new BehaviorSubject<Designer>(null);
  private designer: Designer;

  getDesigner(): Observable<Designer> {
    return this._designer.asObservable();
  }

  getDesignerObject(): Designer {
    return this.designer;
  }

  setDesigner(designer: Designer) {
    this._designer.next(designer);
    //this.designer = designer;
    this.designer = Object.assign({}, designer);
  }

}
