import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchEnquiriesComponent } from './search-enquiries/search-enquiries.component';
const routes: Routes = [
    { path: '', component: SearchEnquiriesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchEnquiriesRoutingModule { }
