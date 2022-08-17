import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewRolesPermissionComponent } from './view-roles-permission/view-roles-permission.component';

const routes: Routes = [
  { path: '', component: ViewRolesPermissionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRolesPermissionRoutingModule { }
