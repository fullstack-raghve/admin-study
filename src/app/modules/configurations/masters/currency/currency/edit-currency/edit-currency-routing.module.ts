import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCurrencyComponent } from './edit-currency/edit-currency.component';
const routes: Routes = [
    {path:'', component: EditCurrencyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCurrencyRoutingModule { }
