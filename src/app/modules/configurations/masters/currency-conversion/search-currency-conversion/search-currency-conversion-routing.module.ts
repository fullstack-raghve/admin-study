import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCurrencyConversionComponent } from './search-currency-conversion/search-currency-conversion.component';
const routes: Routes = [
    {path:'', component: SearchCurrencyConversionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCurrencyConversionRoutingModule { }
