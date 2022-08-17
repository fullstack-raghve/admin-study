import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCuisineComponent } from './edit-cuisine/edit-cuisine.component';

const routes: Routes = [
  {path : '', component : EditCuisineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCuisineRoutingModule { }
