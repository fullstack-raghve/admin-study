import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditRolesPermissionComponent } from './edit-roles-permission/edit-roles-permission.component';

const routes: Routes = [
  { path: '', component: EditRolesPermissionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRolesPermissionRoutingModule { }
