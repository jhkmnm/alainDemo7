import { Component, Injector, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { CreateOrUpdateUserInput, UserEditDto, UserListDto, UserRoleDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-createorupdate-user',
  templateUrl: './create-or-update.component.html',
})
/**
 * 用户表
 */
export class CreateOrUpdateComponent extends ModalComponentBase implements OnInit {
  @Input() id: number | null;
  user: UserEditDto = undefined;
  roles: UserRoleDto[] = null;

  roleList = [];

  constructor(injector: Injector, private _userService: UserServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this.initData(this.id);
  }

  initData(id: number | null): void {
    this._userService.getUserForEdit(id).subscribe((result) => {
      this.user = result.user;
      this.roles = result.roles;
      this.user.isLockoutEnabled = false;
      this.user.needToChangeThePassword = false;
      this.roles.forEach((item) => {
        this.roleList.push({
          label: item.roleDisplayName,
          value: item.roleName,
          checked: item.isAssigned,
        });
      });
    });
  }

  save(): void {
    let tmpRoleNames = [];
    this.roleList.forEach((item) => {
      if (item.checked) {
        tmpRoleNames.push(item.value);
      }
    });
    let createOrUpdateDto = new CreateOrUpdateUserInput();
    createOrUpdateDto.assignedRoleNames = tmpRoleNames;
    createOrUpdateDto.user = this.user;
    this._userService
      .createOrUpdate(createOrUpdateDto)
      .pipe(finalize(() => {}))
      .subscribe(() => {
        this.success();
      });
  }
}
