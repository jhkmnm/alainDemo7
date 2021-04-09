import { Directive, Injector, OnInit } from '@angular/core';
import { STChange } from '@delon/abc/st';
import { AppComponentBase } from './app-component-base';

export class EntityDto {
  id: number;
}

export class PagedRequestDto {
  skipCount: number;
  maxResultCount: number;
  sorting: string;
}

@Directive()
export abstract class PagedListingComponentBase<TEntityDto> extends AppComponentBase implements OnInit {
  public pageSize = 10;
  public pageIndex = 1;
  // public totalPages = 1;
  public totalItems: number;
  public isTableLoading = false;
  public allChecked = false;
  public allCheckboxDisabled = false;
  public checkboxIndeterminate = false;
  public selectedDataItems: any[] = [];
  public sorting: string = undefined;
  filterText = '';
  dataList: EntityDto[] = [];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.refresh();
  }

  public booleanFilterList: any[] = [
    { text: this.l('All'), value: 'All' },
    { text: this.l('Yes'), value: true },
    { text: this.l('No'), value: false },
  ];

  refresh(): void {
    this.pageIndex = 1;
    this.restCheckStatus(this.dataList);
    this.getDataPage(this.pageIndex);
  }

  public change(ret: STChange) {
    if (ret.type === 'checkbox') {
      debugger;
      console.log('checkbox');
      this.refreshCheckStatus(this.dataList);
    } else if (ret.type === 'pi') {
      this.pageNumberChange(ret.pi);
    } else if (ret.type === 'ps') {
      this.pageSizeChange(ret.ps);
    }
  }

  public getDataPage(page: number): void {
    const req = new PagedRequestDto();
    req.maxResultCount = this.pageSize;
    req.skipCount = (page - 1) * this.pageSize;
    req.sorting = this.sorting;
    this.isTableLoading = true;
    this.list(req, () => {
      this.isTableLoading = false;
      this.refreshAllCheckBoxDisabled();
    });
  }

  // 是否全选
  refreshAllCheckBoxDisabled(): void {
    this.allCheckboxDisabled = this.dataList.length <= 0;
  }

  public pageNumberChange($event: any): void {
    this.pageIndex = parseInt($event);
    if (this.pageIndex > 0) {
      this.restCheckStatus(this.dataList);
      this.getDataPage(this.pageIndex);
    }
  }

  public pageSizeChange($event: any): void {
    this.pageSize = parseInt($event);
    this.restCheckStatus(this.dataList);
    this.getDataPage(this.pageIndex);
  }

  // 全选
  checkAll(value: boolean): void {
    this.dataList.forEach((data) => ((<any>data).checked = this.allChecked));
    this.refreshCheckStatus(this.dataList);
  }

  // 刷新选中状态
  refreshCheckStatus(entityList: any[]): void {
    // 是否全部选中
    const allChecked = entityList.every((value) => value.checked === true);
    // 是否全部未选中
    const allUnChecked = entityList.every((value) => !value.checked);
    // 是否全选
    this.allChecked = allChecked;
    // 全选框样式控制
    this.checkboxIndeterminate = !allChecked && !allUnChecked;
    // 已选中数据
    this.selectedDataItems = entityList.filter((value) => value.checked);
  }

  restCheckStatus(entityList: any[]): void {
    this.allChecked = false;
    this.checkboxIndeterminate = false;
    // 已选中数据
    this.selectedDataItems = [];
    // 设置数据为未选中状态
    entityList.forEach((value) => (value.checked = false));
  }

  protected abstract list(request: PagedRequestDto, finishedCallback: () => void): void;
  protected abstract delete(entity: TEntityDto): void;
}
