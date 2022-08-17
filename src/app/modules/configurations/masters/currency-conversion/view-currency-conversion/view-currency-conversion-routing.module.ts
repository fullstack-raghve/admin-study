import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCurrencyConversionComponent } from './view-currency-conversion/view-currency-conversion.component';
const routes: Routes = [
    {path:'', component: ViewCurrencyConversionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCurrencyConversionRoutingModule { }
