import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCorporateAccountComponent } from './search-corporate-account/search-corporate-account.component';

const routes: Routes = [
  {path:'' , component:SearchCorporateAccountComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCorporateAccountRoutingModule { }
