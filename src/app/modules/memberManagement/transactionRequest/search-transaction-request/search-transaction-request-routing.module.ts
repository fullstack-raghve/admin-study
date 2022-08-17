import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchTransactionRequestComponent } from './search-transaction-request/search-transaction-request.component';

const routes: Routes = [
  { path: '', component: SearchTransactionRequestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchTransactionRequestRoutingModule { }
