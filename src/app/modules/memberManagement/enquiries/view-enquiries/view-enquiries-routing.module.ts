import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewEnquiriesComponent } from './view-enquiries/view-enquiries.component';
const routes: Routes = [
    { path: '', component: ViewEnquiriesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEnquiriesRoutingModule { }
