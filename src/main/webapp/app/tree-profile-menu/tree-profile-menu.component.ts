import { Component, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IUser } from 'app/entities/user/user.model';
import { MaincontrollerService } from 'app/maincontroller.service';
import {MenuItem, MessageService, TreeNode} from 'primeng/api';
import { Designer, Topic} from '@wisemapping/mindplot';
import { Router } from '@angular/router';
import { DesignerGlobalService } from 'app/designer-global.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'jhi-tree-profile-menu',
  templateUrl: './tree-profile-menu.component.html',
  styleUrls: ['./tree-profile-menu.component.scss'],
  providers: [MessageService]
})
export class TreeProfileMenuComponent implements OnInit {

  topics: TreeNode[] = [];
  selectedTopic: TreeNode;
  account: Account |  null;
  user: IUser;
  designer: Designer;
  items: MenuItem[] = [];
  json = '';
  topicsMindmap: Topic[] = [];
  subscription: Subscription;
  node: any;
  index = 0;
  me = this;

  constructor(private accountService: AccountService,
              private designerGlobalService: DesignerGlobalService,
              private maincontrollerService: MaincontrollerService,
              private router: Router,
              private messageService: MessageService,) {
              }

  ngOnInit() {
    this.items = [
      {label: 'View', icon: 'pi pi-search', command: (event) => this.viewFile(this.selectedTopic)},
      {label: 'Unselect', icon: 'pi pi-times', command: (event) => this.unselectFile()}
  ];
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.maincontrollerService.findAuthenticatedUser().subscribe(u => {
        this.user = u.body;
        this.subscription = this.designerGlobalService.getDesigner().subscribe(designer => {
          this.designer = designer;
          if(this.designer.getMindmap()) {
            this.topicsMindmap = this.designer.getMindmap().getBranches();
            this.topics = this.createTree(this.topicsMindmap);
          }
        });
      });
    });
  }

  viewFile(topic: TreeNode) {
    const aid: number[] = [];
    let node = topic.data
    while(node !== undefined) {
      aid.push(node.getId());
      node = node.getParent();
    }
    this.openPath(aid);
    this.messageService.add({severity: 'info', summary: 'Node Details', detail: 'Open ' + topic.label});
  }

  unselectFile() {
      this.selectedTopic = null;
  }

  findParent(arr, diagId) {
    return arr.find((parent) => parent.getId() === diagId);
  }

  createTreeNode(node) {
    const children = node.getChildren();
    if(children.length > 0) {
      return {
        label: node.getProperty('text'),
        data: node,

        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        key: node.getProperty('id'),
        children: (node.getChildren() !== undefined)
          ? node.getChildren().map(n => this.createTreeNode(n))
          : undefined
      };
    } else {
      return {
        label: node.getProperty('text'),
        data: node,
        icon: 'pi pi-heart-fill',
        key: node.getProperty('id'),
        children: (node.getChildren() !== undefined)
          ? node.getChildren().map(n => this.createTreeNode(n))
          : undefined
      };
    }
  }

  createTree(data) {
    return data
      // first restructure existing nodes as a tree
      .reduce((result, value, index, originalArray) => {
        const par = value.getParent();
        if (par !== undefined) {
          const parent = this.findParent(originalArray, value.getParent().getId());

          if (parent) {
            // add as child if has parent
            parent.children = (parent.getChildren() || []).concat(value);
          }

          return result;
        } else {
          // Add value to top level of the result array
          return result.concat(value);
        }
      }, [] /* Initialize with empty result array */)
      // them map to new data type
      .map(n => this.createTreeNode(n));
  }


  expandAll(){
    this.topics.forEach( node => {
        this.expandRecursive(node, true);
    } );
  }

  collapseAll(){
      this.topics.forEach( node => {
          this.expandRecursive(node, false);
      } );
  }

  openPath(arr_path: number[]): void {
    const q = arr_path.toString();
    this.router.navigate(['/mindmap-profile/profile'], { queryParams: {q: q} }).then(() => {
      this.collapseAll();
    });
  }

  private expandRecursive(node:TreeNode, isExpand:boolean){
    node.expanded = isExpand;
    if (node.children){
        node.children.forEach( childNode => {
            this.expandRecursive(childNode, isExpand);
        } );
    }
  }
}
