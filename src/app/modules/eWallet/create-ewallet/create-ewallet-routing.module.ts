import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEWalletComponent } from './create-ewallet.component'; 

const routes: Routes = [
  { path: '', component: CreateEWalletComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateEWalletRoutingModule { }
