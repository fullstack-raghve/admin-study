import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewFeedbackAndEnquiryComponent } from './view-feedback-and-enquiry/view-feedback-and-enquiry.component';

const routes: Routes = [
  { path: '', component: ViewFeedbackAndEnquiryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewFeedbackAndEnquiryRoutingModule { }
