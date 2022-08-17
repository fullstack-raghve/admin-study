import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCustomerSegmentsComponent } from './edit-customer-segments/edit-customer-segments.component';
const routes: Routes = [
    { path: '', component: EditCustomerSegmentsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCustomerSegmentsRoutingModule { }
