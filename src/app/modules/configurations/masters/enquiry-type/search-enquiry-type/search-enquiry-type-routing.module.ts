import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchEnquiryTypeComponent } from './search-enquiry-type/search-enquiry-type.component';
const routes: Routes = [
    { path: '', component: SearchEnquiryTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchEnquiryTypeRoutingModule { }
