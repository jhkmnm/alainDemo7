import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { CreateTenantDto, CreateTenantInput, TenantEditDto, TenantServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tenants-createOrupdate',
  templateUrl: './create-or-update.component.html',
})
/**
 * 租户
 */
export class CreateOrUpdateTenantComponent extends ModalComponentBase implements OnInit {
  @Input() id: number | null;
  record: TenantEditDto;
  saving = false;

  schema: SFSchema = {
    properties: {
      tenancyName: { type: 'string', title: '租户编码', maxLenght: 64 },
      name: { type: 'string', title: '租户名称', maxLenght: 128 },
      adminEmailAddress: { type: 'string', title: '管理员账号', maxLenght: 256 },
      adminPassword: { type: 'string', title: '管理员密码', maxLenght: 128 },
      connectionString: { type: 'string', title: '连接字符串', maxLenght: 1024 },
      isActive: { type: 'boolean', title: '是否激活' },
    },
    required: ['tenancyName', 'name', 'adminEmailAddress', 'adminPassword'],
  };
  ui: SFUISchema = {
    '*': { spanLabelFixed: 100, grid: { span: 24 } },
  };

  constructor(injector: Injector, private _tenantService: TenantServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.record = new TenantEditDto();
    if (this.id) {
      this._tenantService.getForEdit(this.id).subscribe((res) => {
        this.record = res;
      });
    }
  }

  save(value: any) {
    this.saving = true;
    if (this.id) {
      this.edit(value);
    } else {
      this.create(value);
    }
  }

  create(value: any) {
    const input = CreateTenantInput.fromJS(value);
    this._tenantService
      .create(input)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe((res) => {
        this.msgSrv.success('保存成功');
        this.success();
      });
  }

  edit(value: any) {
    const input = TenantEditDto.fromJS(value);
    this._tenantService
      .update(input)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe((res) => {
        this.msgSrv.success('保存成功');
        this.success();
      });
  }

  close() {
    super.close();
  }
}
