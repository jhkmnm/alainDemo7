import { Component, Injector, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { CreateOrUpdateUserInput, UserListDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
   selector: 'app-user',
   templateUrl: './user.component.html'
})
/**
 * 用户表
 */
export class UserComponent extends PagedListingComponentBase<UserListDto> implements OnInit {
   query: {
      filterText: string;
      isActive: boolean | null;
   } = {
         filterText: "",
         isActive: null
      };
   createOrUpdateDto: CreateOrUpdateUserInput = new CreateOrUpdateUserInput();
   form: FormGroup;

   constructor(
      injector: Injector,
      fb: FormBuilder,
      private _userService: UserServiceProxy,
      private router: Router,
      private activatedRoute: ActivatedRoute,
   ) {
      super(injector);

      this.form = fb.group({
         userName: [null, [Validators.required]],
         emailAddress: [null, [Validators.required]],
         phoneNumber: [null, [Validators.required]],
         password: [null, [Validators.required]],
         profilePictureId: [null],
         isActive: [null],
         isLockoutEnabled: [null],
         needToChangeThePassword: [null]
      });
   }

   get userName(): AbstractControl {
      return this.form.controls.userName;
   }

   get emailAddress(): AbstractControl {
      return this.form.controls.emailAddress;
   }

   get phoneNumber(): AbstractControl {
      return this.form.controls.phoneNumber;
   }

   get password(): AbstractControl {
      return this.form.controls.password;
   }

   ngOnInit() {
      super.ngOnInit();
   }

   initData(id: number | null): void {
      const self = this;

      this._userService.getUserForEdit(id).subscribe((result) => {
         debugger;
         this.createOrUpdateDto.user = result.user;
      });
   }

   protected list(request: PagedRequestDto, finishedCallback: () => void): void {
      this._userService
         .getPaged(null, null, null,
            this.query.isActive, false,
            this.query.filterText,
            request.sorting,
            request.maxResultCount,
            request.skipCount
         )
         .pipe(finalize(finishedCallback))
         .subscribe(result => {
            this.dataList = result.items;
            this.totalItems = result.totalCount;
         });
   }

   inputInvalid(): boolean {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      this.phoneNumber.markAsDirty();
      this.phoneNumber.updateValueAndValidity();
      this.emailAddress.markAsDirty();
      this.emailAddress.updateValueAndValidity();
      if (
         this.userName.invalid ||
         this.password.invalid ||
         this.phoneNumber.invalid ||
         this.emailAddress.invalid
      ) {
         return false;
      }
      return true;
   }

   create(tpl: TemplateRef<{}>): void {
      this.initData(null);

      this.modal.create({
         nzTitle: this.l("CreateNewUser"),
         nzContent: tpl,
         nzOnOk: (): boolean => {
            if (this.inputInvalid()) {
               this._userService.createOrUpdate(this.createOrUpdateDto)
                  .subscribe((result) => this.refresh());
               return true;
            } else {
               return false;
            }
         }
      })
   }

   edit(tpl: TemplateRef<{}>, entity: UserListDto): void {
      this.initData(entity.id);

      let title = this.l("EditUser") + '-' + entity.displayName;
      this.modal.create({
         nzTitle: title,
         nzContent: tpl,
         nzOnOk: () => {
            if (this.inputInvalid()) {
               this._userService.createOrUpdate(this.createOrUpdateDto)
                  .subscribe((result) => this.refresh());
            }
         }
      });
   }

   delete(item: UserListDto) {
      this._userService.delete(item.id).subscribe(() => {
         this.refresh();
         this.message.success(this.l('Success'));
      });
   }

   batchDelete() {
      const selectCount = this.selectedDataItems.length;
      if (selectCount <= 0) {
         this.message.warning(this.l('PleaseSelectAtLeastOneItem'));
         return;
      }
      let ids = this.getMappingValueArrayOfkey(this.selectedDataItems, "id");
      this.modal.confirm({
         nzTitle: this.l('AreYouSure'),
         nzContent: this.l('ConfirmDeleteXItemsWarningMessage', selectCount, this.selectedDataItems.length),
         nzOkText: this.l("Yes"),
         nzCancelText: this.l("No"),
         nzOnOk: () => {
            this._userService.batchDelete(ids).subscribe(() => {
               this.refresh();
               this.message.success(this.l("Success"));
            });
         }
      });
   }
}
