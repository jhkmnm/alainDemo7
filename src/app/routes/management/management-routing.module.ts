import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { RoleComponent } from './roles/role.component';
import { TenantComponent } from './tenants/tenant.component';
import { UserComponent } from './users/user.component';

const routes: Routes = [
  { path: 'role', component: RoleComponent },
  { path: 'user', component: UserComponent },
  { path: 'tenant', component: TenantComponent },
  { path: 'auditlog', component: AuditLogsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}
