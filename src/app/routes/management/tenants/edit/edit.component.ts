import { Component, Injector, OnInit } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { CreateOrUpdateRoleInput, RoleEditDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './edit.component.html',
})
export class EditRoleComponent extends ModalComponentBase implements OnInit {
  record: RoleEditDto;
  saving = false;

  schema: SFSchema = {
    properties: {
      displayName: { type: 'string', title: '名称', maxLength: 50 },
      isDefault: { type: 'boolean', title: '默认' },
    },
    required: ['displayName'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(injector: Injector, private _roleService: RoleServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {}

  save(value: any) {
    const input = new CreateOrUpdateRoleInput();
    input.role = RoleEditDto.fromJS(value);

    this.saving = true;
    this._roleService
      .createOrUpdate(input)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe((res) => {
        this.msgSrv.success('角色编辑成功');
        this.success();
      });
  }

  close() {
    super.close();
  }
}
