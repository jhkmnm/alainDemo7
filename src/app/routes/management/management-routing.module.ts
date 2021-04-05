import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './roles/role.component';
import { UserComponent } from './users/user.component';

const routes: Routes = [
  { path: 'role', component: RoleComponent },
  { path: 'user', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule { }
