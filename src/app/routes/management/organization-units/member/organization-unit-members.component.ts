import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto, PagedResultDto } from '@shared/common/paged-listing-component-base';
import { OrganizationUnitUserListDto, OrganizationUnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AddMemberModalComponent } from './add-member/add-member-modal.component';

@Component({
  selector: 'organization-unit-members',
  templateUrl: './organization-unit-members.component.html',
  styles: [],
})
export class OrganizationUnitMembersComponent extends PagedListingComponentBase<OrganizationUnitUserListDto> implements OnInit {
  @Output() memberRemoved = new EventEmitter<number[]>();
  @Output() membersAdded = new EventEmitter<number[]>();

  filterText = '';
  private _organizationUnit: NzTreeNode = null;

  get organizationUnit(): NzTreeNode {
    return this._organizationUnit;
  }

  set organizationUnit(ou: NzTreeNode) {
    if (this._organizationUnit === ou) {
      return;
    }
    this._organizationUnit = ou;
    if (ou) {
      this.refresh();
    }
  }

  constructor(injector: Injector, private _organizationUnitService: OrganizationUnitServiceProxy) {
    super(injector);
  }
  ngOnInit() {}

  protected list(request: PagedRequestDto): Observable<PagedResultDto> {
    return this._organizationUnitService.getPagedOrganizationUnitUsers(
      parseInt(this._organizationUnit.key, 10),
      this.filterText,
      request.sorting,
      request.maxResultCount,
      request.skipCount,
    );
  }

  protected delete(entity: OrganizationUnitUserListDto): void {
    throw new Error('Method not implemented.');
  }

  removeMember(user: OrganizationUnitUserListDto): void {
    const _ouId = parseInt(this.organizationUnit.key);
    this._organizationUnitService.removeUser(user.id, _ouId).subscribe(() => {
      this.refresh();
      this.msgSrv.success(this.l('SuccessfullyRemoved'));
      this.memberRemoved.emit([user.id]);
    });
  }

  addMembers(): void {
    this.modalHelper
      .createStatic(AddMemberModalComponent, {
        organizationUnitId: parseInt(this.organizationUnit.key),
      })
      .subscribe((res: number[]) => {
        if (res) {
          this.membersAdded.emit(res);
          this.refresh();
        }
      });
  }
}
