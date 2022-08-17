import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCurrencyConversionComponent } from './add-currency-conversion/add-currency-conversion.component';
const routes: Routes = [
    {path:'', component: AddCurrencyConversionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCurrencyConversionRoutingModule { }
