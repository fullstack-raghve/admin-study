import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCountryComponent } from './search-country/searchCountry.component';

const routes: Routes = [
  { path: '', component: SearchCountryComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCountryRoutingModule { }
