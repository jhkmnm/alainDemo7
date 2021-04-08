import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { ManagementRoutingModule } from './management-routing.module';
import { CreateOrEditRoleComponent } from './roles/create-or-edit/create-or-edit-role.component';
import { RoleComponent } from './roles/role.component';
import { UserComponent } from './users/user.component';

const COMPONENTS = [RoleComponent, UserComponent, CreateOrEditRoleComponent];

@NgModule({
  imports: [SharedModule, ManagementRoutingModule],
  declarations: [...COMPONENTS],
})
export class ManagementModule {}
