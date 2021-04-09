import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ManagementRoutingModule } from './management-routing.module';
import { RoleComponent } from './roles/role.component';
import { CreateRoleComponent } from './tenants/create/create.component';
import { EditRoleComponent } from './tenants/edit/edit.component';
import { TenantComponent } from './tenants/tenant.component';
import { UserComponent } from './users/user.component';

const COMPONENTS = [RoleComponent, UserComponent, TenantComponent];

const CREATEEDITCOMPONENTS = [CreateRoleComponent, EditRoleComponent];

@NgModule({
  imports: [SharedModule, ManagementRoutingModule, CommonModule],
  declarations: [...COMPONENTS, ...CREATEEDITCOMPONENTS],
})
export class ManagementModule {}
