import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { RoleServiceProxy, TenantListDto, TenantServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { CreateRoleComponent } from './create/create.component';
import { EditRoleComponent } from './edit/edit.component';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenant.component.html',
})
export class TenantComponent extends PagedListingComponentBase<TenantListDto> implements OnInit {
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '租户编码',
      },
    },
  };

  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { type: 'checkbox' },
    { title: this.l('RoleName'), index: 'displayName' },
    { title: this.l('CreationTime'), type: 'date', dateFormat: 'yyyy-MM-dd', index: 'creationTime' },
    { title: this.l('IsDefault'), type: 'yn', index: 'isDefault' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: EditRoleComponent,
          },
          params: (record: STData) => {
            return { record };
          },
          click: (record, modal) => {
            if (modal == true) {
              this.refresh();
            }
          },
        },
        {
          text: '删除',
          icon: 'close',
          type: 'del',
          popTitle: '确定删除该租户',
          click: (record: STData, modal?: any, instance?: STComponent) => {
            this.delete(record, modal, instance);
          },
        },
      ],
    },
  ];

  constructor(injector: Injector, private _tenantService: TenantServiceProxy, private _roleService: RoleServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected list(request: PagedRequestDto, finishedCallback: () => void): void {
    this._roleService
      .getPaged(null, this.filterText, null, request.maxResultCount, request.skipCount)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  create() {
    this.modalHelper.createStatic(CreateRoleComponent, { i: { id: 0 } }).subscribe((res) => {
      if (res === true) {
        this.refresh();
      }
    });
  }

  delete(record: STData, modal?: any, instance?: STComponent) {
    this._roleService.delete(record.id).subscribe(() => {
      this.msgSrv.success('删除租户成功');
      this.refresh();
    });
  }

  doSearch(val: any) {
    this.filterText = val.name;
    this.getDataPage(1);
  }
}
