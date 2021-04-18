import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AuditLogDetailModalComponent } from './audit-logs/audit-logs-detail/audit-logs-detail-modal.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { EntityChangeDetailModalComponent } from './audit-logs/entity-change-detail/entity-change-detail-modal.component';
import { EntityChangeComponent } from './audit-logs/entity-change.component';
import { ManagementRoutingModule } from './management-routing.module';
import { CreateOrUpdateRoleComponent } from './roles/create-or-update/role.createorupdate.component';
import { RoleComponent } from './roles/role.component';
import { CreateOrUpdateTenantComponent } from './tenants/create-or-update/create-or-update.component';
import { TenantComponent } from './tenants/tenant.component';
import { CreateOrUpdateComponent } from './users/create-or-update/create-or-update.component';
import { UserComponent } from './users/user.component';

const COMPONENTS = [RoleComponent, UserComponent, TenantComponent, AuditLogsComponent];

const CREATEEDITCOMPONENTS = [
  CreateOrUpdateComponent,
  CreateOrUpdateTenantComponent,
  CreateOrUpdateRoleComponent,
  EntityChangeComponent,
  AuditLogDetailModalComponent,
  EntityChangeDetailModalComponent,
];

@NgModule({
  imports: [SharedModule, ManagementRoutingModule, CommonModule],
  declarations: [...COMPONENTS, ...CREATEEDITCOMPONENTS],
})
export class ManagementModule {}
