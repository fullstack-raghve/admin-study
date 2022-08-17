import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewEWalletComponent } from './view-ewallet.component';

const routes: Routes = [
  { path: '', component: ViewEWalletComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEWalletRoutingModule { }
