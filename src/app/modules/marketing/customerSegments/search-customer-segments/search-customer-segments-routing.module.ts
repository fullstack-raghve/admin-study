import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCustomerSegmentsComponent } from './search-customer-segments/search-customer-segments.component';
const routes: Routes = [
    { path: '', component: SearchCustomerSegmentsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCustomerSegmentsRoutingModule { }
