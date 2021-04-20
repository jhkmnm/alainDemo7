import { Component, OnInit, Injector, Input } from '@angular/core';
import {
   OrganizationUnitServiceProxy,
   CreateOrganizationUnitInput,
   UpdateOrganizationUnitInput,
   OrganizationUnitListDto,
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ModalComponentBase } from '@shared/common/modal-component-base';

export interface IOrganizationUnitOnEdit {
   id?: number;
   parentId?: number;
   displayName?: string;
   parentDisplayName?: string;
   organizationType?: number;
}

@Component({
   selector: 'createOrEditOrganizationUnitModal',
   templateUrl: './unit.createorupdate.component.html',
   styles: [],
})
export class CreateOrEditUnitModalComponent extends ModalComponentBase implements OnInit {
   organizationUnit: IOrganizationUnitOnEdit;
   saving = false;
   organizationTypeList: any[] = [
      { text: 'None', value: 0 },
      { text: '客户', value: 1 },
      { text: '供应商', value: 2 },
   ];

   constructor(injector: Injector, private organizationUnitService: OrganizationUnitServiceProxy) {
      super(injector);
   }

   ngOnInit() {
      this.organizationUnit.organizationType = 0;
      if (this.organizationUnit.id) {
         this.organizationUnitService.getForEdit(this.organizationUnit.id).subscribe((res) => {
            this.organizationUnit.id = res.id;
            this.organizationUnit.displayName = res.displayName;
            this.organizationUnit.parentId = res.parentId;
            this.organizationUnit.organizationType = res.organizationType;
         });
      }
   }

   save(): void {
      if (this.organizationUnit.id) {
         this.updateUnit();
      } else {
         this.createUnit();
      }
   }

   updateUnit(): any {
      const updateInput = new UpdateOrganizationUnitInput();
      updateInput.id = this.organizationUnit.id;
      updateInput.displayName = this.organizationUnit.displayName;
      updateInput.organizationType = this.organizationUnit.organizationType;
      this.saving = true;
      this.organizationUnitService
         .update(updateInput)
         .pipe(finalize(() => (this.saving = false)))
         .subscribe((result) => {
            this.msgSrv.success(this.l('SavedSuccessfully'));
            this.success(result);
         });
   }
   createUnit(): any {
      const input = new CreateOrganizationUnitInput();
      input.parentId = this.organizationUnit.parentId;
      input.displayName = this.organizationUnit.displayName;
      input.organizationType = this.organizationUnit.organizationType;
      this.saving = true;

      this.organizationUnitService
         .create(input)
         .pipe(finalize(() => (this.saving = false)))
         .subscribe((result: OrganizationUnitListDto) => {
            this.msgSrv.success(this.l('SavedSuccessfully'));
            this.success(result);
         });
   }
}
