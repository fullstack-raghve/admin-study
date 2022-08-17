import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditEnquiryTypeComponent } from './edit-enquiry-type/edit-enquiry-type.component';
const routes: Routes = [
    { path: '', component: EditEnquiryTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEnquiryTypeRoutingModule { }
