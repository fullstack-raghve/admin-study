import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionListingComponent } from './transaction-listing/transaction-listing.component';

const routes: Routes = [
  { path: '', component: TransactionListingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionListingRoutingModule { }
