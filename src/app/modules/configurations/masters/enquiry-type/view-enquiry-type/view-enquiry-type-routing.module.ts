import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewEnquiryTypeComponent } from './view-enquiry-type/view-enquiry-type.component';
const routes: Routes = [
    { path: '', component: ViewEnquiryTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEnquiryTypeRoutingModule { }
