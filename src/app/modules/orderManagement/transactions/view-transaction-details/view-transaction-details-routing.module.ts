import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTransactionDetailsComponent } from './view-transaction-details/view-transaction-details.component';

const routes: Routes = [
  { path: '', component: ViewTransactionDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewTransactionDetailsRoutingModule { }
