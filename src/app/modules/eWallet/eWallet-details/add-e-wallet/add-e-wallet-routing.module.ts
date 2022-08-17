import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEWalletComponent } from './add-e-wallet/add-e-wallet.component';

const routes: Routes = [
  {path : '' , component : AddEWalletComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEWalletRoutingModule { }
