import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCuisineComponent } from './search-cuisine/search-cuisine.component';

const routes: Routes = [
  {path : '',component:SearchCuisineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCuisineRoutingModule { }
