import { Component, Injector } from '@angular/core';
import {
  NameValueDto,
  OrganizationUnitServiceProxy,
  UsersToOrganizationUnitInput,
  FindUsersInput,
} from '@shared/service-proxies/service-proxies';
import { PagedRequestDto, PagedResultDto } from '@shared/common/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { map as _map } from 'lodash-es';
import { Observable } from 'rxjs';
import { ModalPagedListingComponentBase } from '@shared/common/modal-paged-listing-component-base';

@Component({
  selector: 'addMemberModal',
  templateUrl: './add-member-modal.component.html',
  styles: [],
})
export class AddMemberModalComponent extends ModalPagedListingComponentBase<NameValueDto> {
  organizationUnitId: number;
  filterText = '';
  saving = false;

  constructor(injector: Injector, private _organizationUnitService: OrganizationUnitServiceProxy) {
    super(injector);
  }

  protected list(request: PagedRequestDto): Observable<PagedResultDto> {
    const input = new FindUsersInput();
    input.organizationUnitId = this.organizationUnitId;
    input.filterText = this.filterText;
    input.skipCount = request.skipCount;
    input.maxResultCount = request.maxResultCount;
    return this._organizationUnitService.findUsers(input);
  }

  addUsersToOrganizationUnit(): void {
    const selectCount = this.selectedDataItems.length;
    if (selectCount <= 0) {
      this.msgSrv.warning(this.l('PleaseSelect'));
      return;
    }
    this.saving = true;
    const input = new UsersToOrganizationUnitInput();
    input.organizationUnitId = this.organizationUnitId;
    input.userIds = _map(this.selectedDataItems, (selectedMember) => Number(selectedMember.value));

    this._organizationUnitService
      .addUsers(input)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.msgSrv.info(this.l('SavedSuccessfully'));
        this.success(input.userIds);
      });
  }
}
