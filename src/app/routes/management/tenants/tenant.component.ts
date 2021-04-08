import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { TenantListDto, TenantServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

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
    { title: '租户编码', index: 'tenancyName' },
    { title: '名称', index: 'name' },
    { title: '是否激活', type: 'yn', index: 'isActive' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            // component: ,
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
    this.st.page.front = false;
  }

  protected list(request: PagedRequestDto, finishedCallback: () => void): void {
    this._tenantService
      .getPaged(null, null, null, null, null, this.filterText, request.sorting, request.maxResultCount, request.skipCount)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  delete(record: STData, modal?: any, instance?: STComponent) {
    this._tenantService.delete(record.id).subscribe(() => {
      this.message.success('删除租户成功');
      this.message.create('success', '删除租户成功');
      this.refresh();
    });
  }

  doSearch(val: any) {
    this.filterText = val.name;
    this.getDataPage(1);
  }
}
