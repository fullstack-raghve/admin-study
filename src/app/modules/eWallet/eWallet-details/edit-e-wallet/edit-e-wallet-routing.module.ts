import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditEWalletComponent } from './edit-e-wallet/edit-e-wallet.component';

const routes: Routes = [
  {path : '' , component : EditEWalletComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEWalletRoutingModule { }
