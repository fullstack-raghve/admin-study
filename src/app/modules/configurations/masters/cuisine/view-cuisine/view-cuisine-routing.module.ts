import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCuisineComponent } from './view-cuisine/view-cuisine.component';

const routes: Routes = [
  {path : '', component : ViewCuisineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCuisineRoutingModule { }
