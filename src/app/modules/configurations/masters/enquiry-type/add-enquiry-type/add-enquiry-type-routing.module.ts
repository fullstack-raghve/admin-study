import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEnquiryTypeComponent } from './add-enquiry-type/add-enquiry-type.component';
const routes: Routes = [
    { path: '', component: AddEnquiryTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEnquiryTypeRoutingModule { }
