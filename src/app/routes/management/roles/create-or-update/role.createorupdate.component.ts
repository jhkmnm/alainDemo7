import { Component, ElementRef, Inject, Injector, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ArrayService } from '@delon/util';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { CreateOrUpdateRoleInput, RoleListDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { NzTreeComponent, NzTreeModule, NzTreeNode } from 'ng-zorro-antd/tree';
import { PermissionTreeComponent } from '@shared/common/permission-tree/permission-tree.component';
import { WebElement } from 'selenium-webdriver';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-roles-createOrupdate',
  templateUrl: './role.createorupdate.component.html',
})
/**
 * 角色
 */
export class CreateOrUpdateRoleComponent extends ModalComponentBase implements OnInit {
  @Input() id: number | null;
  @ViewChild('permissionTree', { static: false }) permissionTree: PermissionTreeComponent;
  createOrUpdateDto: CreateOrUpdateRoleInput = new CreateOrUpdateRoleInput();
  saving = false;

  constructor(injector: Injector, private _roleService: RoleServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this._roleService.getForEdit(this.id).subscribe((res) => {
      this.createOrUpdateDto.role = res.role;
      this.createOrUpdateDto.grantedPermissionNames = res.grantedPermissionNames;
      this.permissionTree.editData = res;
    });
  }

  save(value: any) {
    this.createOrUpdateDto.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();
    this.saving = true;
    this._roleService
      .createOrUpdate(this.createOrUpdateDto)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe((result) => {
        this.success();
      });
  }

  close() {
    super.close();
  }
}
