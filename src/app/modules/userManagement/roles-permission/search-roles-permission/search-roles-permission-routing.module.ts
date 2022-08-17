import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchRolesPermissionComponent } from './search-roles-permission/search-roles-permission.component';

const routes: Routes = [
  { path: '', component: SearchRolesPermissionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRolesPermissionRoutingModule { }
