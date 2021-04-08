import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { CreateOrUpdateRoleInput, RoleEditDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-createoredit-role',
  templateUrl: './create-or-edit-role.component.html',
})
export class CreateOrEditRoleComponent extends ModalComponentBase implements OnInit {
  @ViewChild('sf', { static: false }) sf: SFComponent;
  record: any = {};
  schema: SFSchema = {
    properties: {
      displayName: { type: 'string', title: this.l('名称'), maxLength: 50 },
      isDefault: { type: 'boolean', title: this.l('默认') },
    },
    required: ['displayName'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $displayName: {
      widget: 'string',
    },
  };

  constructor(
    injector: Injector,
    // fb: FormBuilder,
    private _roleService: RoleServiceProxy,
    private msg: NzMessageService,
  ) {
    super(injector);
    // this.form = fb.group({
    //   name: [null, [Validators.required]],
    //   displayName: [null, [Validators.required]],
    //   normalizedName: [null, [Validators.required]],
    //   isDefault: [true]
    // });
  }

  // get name(): AbstractControl {
  //   return this.form.controls.name;
  // }

  // get displayName(): AbstractControl {
  //   return this.form.controls.displayName;
  // }
  // get normalizedName(): AbstractControl {
  //   return this.form.controls.normalizedName;
  // }

  // inputInvalid(): boolean {
  //   this.name.markAsDirty();
  //   this.name.updateValueAndValidity();
  //   if (
  //     this.name.invalid
  //   ) {
  //     return false;
  //   }
  //   return true;
  // }
  // /**
  //  * 编辑时Id
  //  */
  id?: number;
  saving = false;
  editDto: RoleEditDto = new RoleEditDto();
  // permissionTrees: TreeViewItem[];
  editName: string;
  form: FormGroup;

  ngOnInit() {
    this._roleService.getForEdit(this.id).subscribe((result) => {
      this.editDto = result.role;
      this.editName = result.role.displayName;
    });
  }

  save() {
    this.saving = true;
    const updateInput = new CreateOrUpdateRoleInput();
    updateInput.role = RoleEditDto.fromJS(this.sf.value);

    this._roleService
      .createOrUpdate(updateInput)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.msg.success(this.l('SavedSuccessfully'));
        this.success();
      });
  }
}
