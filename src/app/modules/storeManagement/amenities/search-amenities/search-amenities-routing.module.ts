import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchAmenitiesComponent } from './search-amenities/search-amenities.component';
const routes: Routes = [
  { path: '', component: SearchAmenitiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchAmenitiesRoutingModule { }
