import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCuisineComponent } from './add-cuisine/add-cuisine.component';

const routes: Routes = [
  {path : '', component : AddCuisineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCuisineRoutingModule { }
