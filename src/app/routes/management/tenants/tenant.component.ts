import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { TenantServiceProxy, TenantListDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto, PagedResultDto } from '@shared/common/paged-listing-component-base';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CreateOrUpdateTenantComponent } from './create-or-update/create-or-update.component';

class PagedTenantsRequestDto extends PagedRequestDto {
  keyword: string;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
  creationDateStart: Date | null;
  creationDateEnd: Date | null;
  editionId: number | null;
}

@Component({
  selector: 'app-tenants',
  templateUrl: './tenant.component.html',
})
/**
 * 租户
 */
export class TenantComponent extends PagedListingComponentBase<TenantListDtoPagedResultDto> implements OnInit {
  // 查询
  searchSchema: SFSchema = {
    properties: {},
  };

  searchInput: any = {};

  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { type: 'checkbox' },
    { title: '租户编码', index: 'tenancyName' },
    { title: '租户名称', index: 'name' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: CreateOrUpdateTenantComponent,
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

  constructor(injector: Injector, private _tenantService: TenantServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected list(request: PagedTenantsRequestDto): Observable<PagedResultDto> {
    return this._tenantService.getPaged(
      request.subscriptionStart,
      request.subscriptionEnd,
      request.creationDateStart,
      request.creationDateEnd,
      request.editionId,
      null,
      request.sorting,
      request.maxResultCount,
      request.skipCount,
    );
  }

  create() {
    this.modalHelper.createStatic(CreateOrUpdateTenantComponent, { i: { id: 0 } }).subscribe((res) => {
      if (res === true) {
        this.refresh();
      }
    });
  }

  delete(record: STData, modal?: any, instance?: STComponent) {
    this._tenantService.delete(record.id).subscribe(() => {
      this.msgSrv.success('删除租户成功');
      this.refresh();
    });
  }

  doSearch(val: any) {
    this.getDataPage(1);
  }
}
