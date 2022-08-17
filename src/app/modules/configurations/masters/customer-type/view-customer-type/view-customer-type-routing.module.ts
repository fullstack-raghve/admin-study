import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCustomerTypeComponent } from './view-customer-type/view-customer-type.component';

const routes: Routes = [
  {path:'',component:ViewCustomerTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCustomerTypeRoutingModule { }
