import { Directive, Injector, OnInit } from '@angular/core';
import { STChange } from '@delon/abc/st';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AppComponentBase } from './app-component-base';

export class PagedResultDto {
  items: any[];
  totalCount: number;
}

export class EntityDto {
  id: number;
}

export class PagedRequestDto {
  skipCount: number;
  maxResultCount: number;
  sorting: string;
}

export class PageingInfo {
  pageSize: number = 10;
  pageNumber: number = 1;
  totalItems: number;
  isTableLoading = false;
}

@Directive()
export abstract class PagedListingComponentBase<TEntityDto> extends AppComponentBase implements OnInit {
  public pageingInfo = new PageingInfo();
  filterText = '';
  dataList: EntityDto[] = [];
  sorting = '';

  public allChecked = false;
  public allCheckboxDisabled = false;
  public checkboxIndeterminate = false;
  public selectedDataItems: any[] = [];

  private debounceTimeTag: any = undefined;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.refresh();
  }

  public booleanFilterList: any[] = [
    { text: this.l('All'), value: null },
    { text: this.l('Yes'), value: true },
    { text: this.l('No'), value: false },
  ];

  refresh(): void {
    if (this.debounceTimeTag) {
      clearTimeout(this.debounceTimeTag);
      this.debounceTimeTag = undefined;
    }
    this.debounceTimeTag = setTimeout(() => {
      this.debounceTimeTag = undefined;
      this.pageingInfo.pageNumber = 1;
      this.restCheckStatus(this.dataList);
      this.getDataPage(this.pageingInfo.pageNumber);
    }, 100);
  }

  public change(ret: STChange) {
    if (ret.type === 'checkbox') {
      this.refreshCheckStatus(this.dataList);
    } else if (ret.type === 'pi') {
      this.pageNumberChange(ret.pi);
    } else if (ret.type === 'ps') {
      this.pageSizeChange(ret.ps);
    }
  }

  public getDataPage(page: number): void {
    const req = new PagedRequestDto();
    req.maxResultCount = this.pageingInfo.pageSize;
    req.skipCount = (page - 1) * this.pageingInfo.pageSize;
    req.sorting = this.sorting;
    this.pageingInfo.isTableLoading = true;
    this.list(req)
      .pipe(
        finalize(() => {
          this.pageingInfo.isTableLoading = false;
          this.refreshAllCheckBoxDisabled();
        }),
        catchError((error) => {
          return error;
        }),
      )
      .subscribe((result: PagedResultDto) => {
        this.dataList = result.items;
        this.pageingInfo.totalItems = result.totalCount;
      });
  }

  // 是否全选
  refreshAllCheckBoxDisabled(): void {
    this.allCheckboxDisabled = this.dataList.length <= 0;
  }

  public pageNumberChange($event: any): void {
    this.pageingInfo.pageNumber = parseInt($event);
    if (this.pageingInfo.pageNumber > 0) {
      this.restCheckStatus(this.dataList);
      this.getDataPage(this.pageingInfo.pageNumber);
    }
  }

  public pageSizeChange($event: any): void {
    this.pageingInfo.pageSize = parseInt($event);
    this.restCheckStatus(this.dataList);
    this.getDataPage(this.pageingInfo.pageNumber);
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

  // protected abstract list(request: PagedRequestDto, finishedCallback: () => void): void;
  protected abstract list(request: PagedRequestDto): Observable<PagedResultDto>;
  protected abstract delete(entity: TEntityDto): void;
}
