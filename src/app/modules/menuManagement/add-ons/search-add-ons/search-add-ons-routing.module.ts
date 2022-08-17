import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchAddOnsComponent } from './search-add-ons/search-add-ons.component';

const routes: Routes = [
  { path: '', component: SearchAddOnsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchAddOnsRoutingModule { }
