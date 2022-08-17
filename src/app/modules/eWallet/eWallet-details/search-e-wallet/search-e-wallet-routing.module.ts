import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchEWalletComponent } from './search-e-wallet/search-e-wallet.component';

const routes: Routes = [
  {path:'' , component : SearchEWalletComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchEWalletRoutingModule { }
