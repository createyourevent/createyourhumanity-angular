import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IUser } from 'app/entities/user/user.model';
import { Designer, Topic } from '@wisemapping/mindplot';
import { DesignerGlobalService } from 'app/designer-global.service'
import { MaincontrollerService } from 'app/maincontroller.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-calculate-percent-of-profile',
  templateUrl: './calculate-percent-of-profile.component.html',
  styleUrls: ['./calculate-percent-of-profile.component.scss']
})
export class CalculatePercentOfProfileComponent implements  OnChanges {

  @Input() userId: string;

  user: IUser;
  topics: Topic[] = [];
  designer: Designer;
  totalTopicsControl = 0;
  percent = '? %';

  account: Account | null = null;

  constructor(private designerGlobalService: DesignerGlobalService,
              private maincontrollerService: MaincontrollerService,) { }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['userId'].currentValue !== undefined) {
      this.userId = changes['userId'].currentValue;
        this.designerGlobalService.getDesigner().subscribe(de => {
          this.designer = de;
          if(this.designer) {
            this.domWalker(this.designer.getMindmap().findNodeById(1));
            this.getPercentOfUser(this.userId);
          }
        });
    }
  }

  domWalker(node) {
    this.parseJSON(node);
    if (node.getChildren().length > 0) {
      node.getChildren().forEach(childNode => {
        this.domWalker(childNode);
      });
    }
}

parseJSON(node) {
    const n = node;
    const f = node.getFeatures()[0];
    const c = node.getControls()[0];
    const l = node.getLayout()[0];
    if(c) {
      this.totalTopicsControl++;
    }
}

getPercentOfUser(userId: string): any {
  this.maincontrollerService.findFormulaDataByUserId(userId).subscribe(fd => {
    const formulaData = fd.body;
    const map = JSON.parse(formulaData.map);
    var size = Object.keys(map).length;
    this.percent = (this.totalTopicsControl / 100 * size) + '%';
  });
}

}
