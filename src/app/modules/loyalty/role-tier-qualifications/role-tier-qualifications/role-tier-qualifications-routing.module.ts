import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleTierQualificationsComponent } from './role-tier-qualifications/role-tier-qualifications.component';

const routes: Routes = [
  {path:'',component:RoleTierQualificationsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleTierQualificationsRoutingModule { }
