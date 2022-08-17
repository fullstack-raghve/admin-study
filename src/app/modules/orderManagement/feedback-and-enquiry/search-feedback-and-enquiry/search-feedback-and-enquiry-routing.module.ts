import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFeedbackAndEnquiryComponent } from './search-feedback-and-enquiry/search-feedback-and-enquiry.component';
const routes: Routes = [
  { path: '', component: SearchFeedbackAndEnquiryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchFeedbackAndEnquiryRoutingModule { }
