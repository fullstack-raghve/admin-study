import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBrandsComponent } from './view-brands/view-brands.component';
const routes: Routes = [
    {path:'', component:ViewBrandsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewBrandsRoutingModule { }
