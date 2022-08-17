import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPgTransactionComponent } from './search-pg-transaction/search-pg-transaction.component';

const routes: Routes = [
  { path: '', component: SearchPgTransactionComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchPgTransactionRoutingModule { }
