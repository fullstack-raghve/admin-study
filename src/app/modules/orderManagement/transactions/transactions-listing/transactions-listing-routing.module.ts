import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionsListingComponent } from './transactions-listing/transactions-listing.component';

const routes: Routes = [
  { path: '', component: TransactionsListingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsListingRoutingModule { }
