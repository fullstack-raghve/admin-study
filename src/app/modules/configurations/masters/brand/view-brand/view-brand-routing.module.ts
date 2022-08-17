import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBrandComponent } from './view-brand/view-brand.component';

const routes: Routes = [
  {path:'',component:ViewBrandComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewBrandRoutingModule { }
