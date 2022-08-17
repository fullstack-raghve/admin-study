import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomerTypeComponent } from './add-customer-type/add-customer-type.component';

const routes: Routes = [
  {path:'',component:AddCustomerTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCustomerTypeRoutingModule { }
