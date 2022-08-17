import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
const routes: Routes = [
    {path:'', component:ViewTransactionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewTransactionRoutingModule { }