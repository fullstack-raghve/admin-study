import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveOrdersListingComponent } from './live-orders-listing/live-orders-listing.component';

const routes: Routes = [
  { path: '', component: LiveOrdersListingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveOrdersListingRoutingModule { }
