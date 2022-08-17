import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBrandsComponent } from './add-brands-management/add-brands-management.component';
const routes: Routes = [
    {path:'', component:AddBrandsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBrandsRoutingModule { }
