import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { ManagementRoutingModule } from './management-routing.module';
import { RoleComponent } from './roles/role.component';
import { UserComponent } from './users/user.component';

const COMPONENTS = [RoleComponent, UserComponent];

@NgModule({
  imports: [SharedModule, ManagementRoutingModule, FormsModule],
  declarations: [...COMPONENTS],
})
export class ManagementModule { }
