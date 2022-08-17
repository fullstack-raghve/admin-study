import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchLocationsComponent } from './search-locations/search-locations.component';

const routes: Routes = [
  { path: '', component: SearchLocationsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchLocationsRoutingModule { }
