import { OnInit, Injector, Directive } from '@angular/core';
import { STChange } from '@delon/abc/st';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { PagedResultDto, PagedRequestDto, PageingInfo, PagedListingComponentBase } from '@shared/common/paged-listing-component-base';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Directive()
export abstract class ModalPagedListingComponentBase<EntityDto> extends ModalComponentBase implements OnInit {
  dataList: EntityDto[] = [];
  public pageingInfo = new PageingInfo();
  public sorting: string = undefined;
  filterText = '';
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

  checkAll(value: boolean): void {
    this.dataList.forEach((data) => ((<any>data).checked = this.allChecked));
    this.refreshCheckStatus(this.dataList);
  }

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

  refreshAllCheckBoxDisabled(): void {
    this.allCheckboxDisabled = this.dataList.length <= 0;
  }

  protected abstract list(request: PagedRequestDto): Observable<PagedResultDto>;
}
