import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCustomerTypeComponent } from './edit-customer-type/edit-customer-type.component';

const routes: Routes = [
  {path:'',component:EditCustomerTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCustomerTypeRoutingModule { }
