import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCitiesComponent } from './search-cities/search-cities.component';
const routes: Routes = [
    {path:'', component: SearchCitiesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCitiesRoutingModule { }
