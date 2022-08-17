import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduledOrdersListingComponent } from './scheduled-orders-listing/scheduled-orders-listing.component';

const routes: Routes = [
  { path: '',  component: ScheduledOrdersListingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduledOrdersListingRoutingModule { }
