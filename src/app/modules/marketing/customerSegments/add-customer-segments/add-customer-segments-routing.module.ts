import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomerSegmentsComponent } from './add-customer-segments/add-customer-segments.component';
const routes: Routes = [
    { path: '', component: AddCustomerSegmentsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCustomerSegmentsRoutingModule { }
