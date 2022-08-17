import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCountryComponent } from './view-country/view-country.component';

const routes: Routes = [
  { path: '', component: ViewCountryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCountryRoutingModule { }
