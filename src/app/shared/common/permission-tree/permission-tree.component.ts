import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ArrayService } from '@delon/util';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { AppComponentBase } from '../app-component-base';
import { PermissionTreeDataModel } from './permission-tree-data.model';

@Component({
   selector: 'permission-tree',
   templateUrl: './permission-tree.component.html',
})
export class PermissionTreeComponent extends AppComponentBase implements OnInit {
   @ViewChild("nzTreePermission", { static: false }) treePermission: NzTreeComponent

   private _editData: PermissionTreeDataModel;

   defaultCheckedPermissionNames: string[] = [];

   checkStrictly = true;

   loading = false;

   set editData(val: PermissionTreeDataModel) {
      this._editData = val;
      this.defaultCheckedPermissionNames = val.grantedPermissionNames;
      this.arrToTreeNode();
   }

   filterText: string;

   _treeData: NzTreeNode[] = [];

   ngOnInit(): void {
   }

   constructor(injector: Injector, private _arrayService: ArrayService) {
      super(injector);
   }

   arrToTreeNode(): void {
      this.loading = true;
      this._treeData = this._arrayService.arrToTreeNode(
         this._editData.permissions,
         {
            idMapName: 'name',
            parentIdMapName: 'parentName',
            titleMapName: 'displayName',
            cb: (item) => { item.expanded = true }
         },
      );

      setTimeout(() => {
         this.checkStrictly = false;
         this.loading = false;
      }, 500);
   }

   reload(): void {
      this.checkStrictly = true;
      this.arrToTreeNode();
      this.filterText = '';
   }

   getGrantedPermissionNames(): string[] {
      const permissionNames: string[] = this._arrayService.getKeysByTreeNode(
         this._treeData, { includeHalfChecked: false }
      );
      return permissionNames;
   }

   filterTextEmptyChange() {
      if (!this.filterText) {
         this.reload();
      }
   }
}
