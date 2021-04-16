import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ArrayService } from '@delon/util';
import { PagedListingComponentBase, PagedRequestDto, PagedResultDto } from '@shared/common/paged-listing-component-base';
import { PermissionTreeComponent } from '@shared/common/permission-tree/permission-tree.component';
import { CreateOrUpdateRoleInput, RoleListDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CreateOrUpdateRoleComponent } from './create-or-update/role.createorupdate.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
})
/**
 * 角色
 */
export class RoleComponent extends PagedListingComponentBase<RoleListDto> implements OnInit {
  @ViewChild('permissionTree', { static: false }) permissionTree: PermissionTreeComponent;

  filterText: string | null;
  createOrUpdateDto: CreateOrUpdateRoleInput = new CreateOrUpdateRoleInput();

  constructor(injector: Injector, private _roleService: RoleServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected list(request: PagedRequestDto): Observable<PagedResultDto> {
    return this._roleService.getPaged(null, this.filterText, null, request.maxResultCount, request.skipCount);
  }

  create(tpl: TemplateRef<{}>): void {
    this.modalHelper.createStatic(CreateOrUpdateRoleComponent, { id: null }).subscribe((res) => {
      if (res) {
        this.refresh();
      }
    });
  }

  edit(tpl: TemplateRef<{}>, entity: RoleListDto): void {
    this.modalHelper.createStatic(CreateOrUpdateRoleComponent, { id: entity.id }).subscribe((res) => {
      if (res) {
        this.refresh();
      }
    });
  }

  delete(item: RoleListDto) {
    this._roleService.delete(item.id).subscribe(() => {
      this.refresh();
      this.msgSrv.success(this.l('Success'));
    });
  }

  batchDelete() {
    const selectCount = this.selectedDataItems.length;
    if (selectCount <= 0) {
      this.msgSrv.warning(this.l('PleaseSelectAtLeastOneItem'));
      return;
    }
    let ids = this.getMappingValueArrayOfkey(this.selectedDataItems, 'id');
    this.modalSrv.confirm({
      nzContent: this.l('ConfirmDeleteXItemsWarningMessage', selectCount, this.selectedDataItems.length),
      nzOkText: this.l('Yes'),
      nzCancelText: this.l('No'),
      nzOnOk: () => {
        this._roleService.batchDelete(ids).subscribe(() => {
          this.refresh();
          this.msgSrv.success(this.l('Success'));
        });
      },
    });
  }
}
