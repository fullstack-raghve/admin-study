import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewOrdersListingComponent } from './new-orders-listing/new-orders-listing.component';


const routes: Routes = [
  { path: '', component: NewOrdersListingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewOrdersListingRoutingModule { }
