import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBrandComponent } from './add-brand/add-brand.component';

const routes: Routes = [
  {path:'',component:AddBrandComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBrandRoutingModule { }
