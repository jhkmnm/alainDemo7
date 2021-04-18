import { Component, OnInit, Injector } from '@angular/core';
import { AuditLogListDto, AuditLogServiceProxy } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto, PagedResultDto } from '@shared/common/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { DateTimeService } from '@shared/common/timing/date-time.service';
import { Observable } from 'rxjs';
import { AuditLogDetailModalComponent } from './audit-logs-detail/audit-logs-detail-modal.component';
import { FileDownloadService } from '@shared/common/file-download.service';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
})
export class AuditLogsComponent extends PagedListingComponentBase<AuditLogListDto> implements OnInit {
  startToEndDate: Date[] = [this._dateTimeService.getStartOfDay().toJSDate(), this._dateTimeService.getEndOfDay().toJSDate()];
  advancedFiltersVisible = false;
  username: string;
  serviceName: string;
  methodName: string;
  browserInfo: string;
  hasException: boolean = undefined;
  minExecutionDuration: number;
  maxExecutionDuration: number;
  exporting = false;

  constructor(
    injector: Injector,
    private _auditLogService: AuditLogServiceProxy,
    private _fileDownloadService: FileDownloadService,
    private _dateTimeService: DateTimeService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected list(request: PagedRequestDto): Observable<PagedResultDto> {
    return this._auditLogService.getPagedAuditLogs(
      this._dateTimeService.getStartOfDayForDate(this.selectedDataItems[0]),
      this._dateTimeService.getEndOfDayForDate(this.startToEndDate[1]),
      this.username,
      this.serviceName,
      this.methodName,
      this.browserInfo,
      this.hasException,
      this.minExecutionDuration,
      this.maxExecutionDuration,
      undefined,
      request.maxResultCount,
      request.skipCount,
    );
  }
  protected delete(entity: AuditLogListDto): void {
    throw new Error('Method not implemented.');
  }

  showDetails(item: AuditLogListDto): void {
    this.modalHelper.create(AuditLogDetailModalComponent, { auditLog: item }).subscribe((result) => {});
  }

  exportToExcelAuditLogs(): void {
    const self = this;
    this.exporting = true;
    self._auditLogService
      .getAuditLogsToExcel(
        this._dateTimeService.getStartOfDayForDate(this.startToEndDate[0]),
        this._dateTimeService.getEndOfDayForDate(this.startToEndDate[1]),
        self.username,
        self.serviceName,
        self.methodName,
        self.browserInfo,
        self.hasException,
        self.minExecutionDuration,
        self.maxExecutionDuration,
        undefined,
        1,
        0,
      )
      .pipe(finalize(() => (this.exporting = false)))
      .subscribe((result) => {
        self._fileDownloadService.downloadTempFile(result);
      });
  }

  truncateStringWithPostfix(text: string, length: number): string {
    return text.substring(0, length); // abp.utils.truncateStringWithPostfix(text, length);
  }
}
