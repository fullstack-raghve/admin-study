import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRolesPermissionComponent } from './create-roles-permission/create-roles-permission.component';

const routes: Routes = [
  { path: '', component: CreateRolesPermissionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRolesPermissionRoutingModule { }
