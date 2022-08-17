import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCurrencyComponent } from './add-currency/add-currency.component';

const routes: Routes = [
    {path:'', component:AddCurrencyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCurrencyRoutingModule { }
