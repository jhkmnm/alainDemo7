import { Component, Injector, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedListingComponentBase, PagedRequestDto, PagedResultDto } from '@shared/common/paged-listing-component-base';
import { UserListDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CreateOrUpdateComponent } from './create-or-update/create-or-update.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
/**
 * 用户表
 */
export class UserComponent extends PagedListingComponentBase<UserListDto> implements OnInit {
  query: {
    filterText: string;
    isActive: boolean | null;
  } = {
    filterText: '',
    isActive: null,
  };

  constructor(injector: Injector, private _userService: UserServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected list(request: PagedRequestDto): Observable<PagedResultDto> {
    return this._userService.getPaged(
      null,
      null,
      null,
      this.query.isActive,
      false,
      this.query.filterText,
      request.sorting,
      request.maxResultCount,
      request.skipCount,
    );
  }

  create(tpl: TemplateRef<{}>): void {
    this.modalHelper.createStatic(CreateOrUpdateComponent, { id: null }).subscribe((result) => {
      if (result) {
        this.refresh();
      }
    });
  }

  edit(tpl: TemplateRef<{}>, entity: UserListDto): void {
    this.modalHelper.createStatic(CreateOrUpdateComponent, { id: entity.id }).subscribe((result) => {
      if (result) {
        this.refresh();
      }
    });
  }

  delete(item: UserListDto) {
    this._userService.delete(item.id).subscribe(() => {
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
      nzTitle: this.l('AreYouSure'),
      nzContent: this.l('ConfirmDeleteXItemsWarningMessage', selectCount, this.selectedDataItems.length),
      nzOkText: this.l('Yes'),
      nzCancelText: this.l('No'),
      nzOnOk: () => {
        this._userService.batchDelete(ids).subscribe(() => {
          this.refresh();
          this.msgSrv.success(this.l('Success'));
        });
      },
    });
  }
}
