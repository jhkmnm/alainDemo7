import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalHelper } from '@delon/theme';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { PermissionTreeComponent } from '@shared/common/permission-tree/permission-tree.component';
import { CreateOrUpdateRoleInput, RoleListDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRoleComponent } from './create-or-edit/create-or-edit-role.component';

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

  constructor(
    injector: Injector,
    private _roleService: RoleServiceProxy,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalHelper: ModalHelper,
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected list(request: PagedRequestDto, finishedCallback: () => void): void {
    this._roleService
      .getPaged(null, this.filterText, null, request.maxResultCount, request.skipCount)
      .pipe(finalize(finishedCallback))
      .subscribe((res) => {
        this.dataList = res.items;
        this.totalItems = res.totalCount;
      });
  }

  protected initData(id: number | null): void {
    const self = this;

    this._roleService.getForEdit(id).subscribe((result) => {
      debugger;
      this.createOrUpdateDto.role = result.role;
      this.createOrUpdateDto.grantedPermissionNames = result.grantedPermissionNames;
      self.permissionTree.editData = result;
    });
  }

  create(tpl: TemplateRef<{}>): void {
    // this.initData(null);

    this.modalHelper.open(CreateOrEditRoleComponent, {}, 'md', { nzMask: true }).subscribe((res) => {
      if (res) {
        this.refresh();
      }
    });
    // this.modal.create({
    //    nzTitle: this.l('CreatingNewRole'),
    //    nzContent: CreateOrEditRoleComponent,
    //    nzOnOk: () => {
    //       this.createOrUpdateDto.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();
    //       this._roleService.createOrUpdate(this.createOrUpdateDto)
    //          .subscribe((res) => this.refresh());
    //    },
    // });
  }

  edit(tpl: TemplateRef<{}>, entity: RoleListDto): void {
    // this.initData(entity.id);

    this.modalHelper.open(CreateOrEditRoleComponent, { id: entity.id }, 'md', { nzMask: true }).subscribe((res) => {
      if (res) {
        this.refresh();
      }
    });

    // let title = this.l('EditingRole') + '-' + entity.displayName;
    // this.modal.create({
    //    nzTitle: title,
    //    nzContent: tpl,
    //    nzOnOk: () => {
    //       this.createOrUpdateDto.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();
    //       this._roleService.createOrUpdate(this.createOrUpdateDto)
    //          .subscribe((result) => this.refresh());
    //    },
    // });
  }

  delete(item: RoleListDto) {
    this._roleService.delete(item.id).subscribe(() => {
      this.refresh();
      this.message.success(this.l('Success'));
    });
  }

  batchDelete() {
    const selectCount = this.selectedDataItems.length;
    if (selectCount <= 0) {
      this.message.warning(this.l('PleaseSelectAtLeastOneItem'));
      return;
    }
    let ids = this.getMappingValueArrayOfkey(this.selectedDataItems, 'id');
    this.modal.confirm({
      nzContent: this.l('ConfirmDeleteXItemsWarningMessage', selectCount, this.selectedDataItems.length),
      nzOkText: this.l('Yes'),
      nzCancelText: this.l('No'),
      nzOnOk: () => {
        this._roleService.batchDelete(ids).subscribe(() => {
          this.refresh();
          this.message.success(this.l('Success'));
        });
      },
    });
  }
}
