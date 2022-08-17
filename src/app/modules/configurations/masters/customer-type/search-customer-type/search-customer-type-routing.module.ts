import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCustomerTypeComponent } from './search-customer-type/search-customer-type.component';

const routes: Routes = [
  {path:'',component:SearchCustomerTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCustomerTypeRoutingModule { }
