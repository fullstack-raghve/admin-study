import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCurrencyComponent } from './search-currency/search-currency.component';
const routes: Routes = [
    {path:'', component: SearchCurrencyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCurrencyRoutingModule { }
