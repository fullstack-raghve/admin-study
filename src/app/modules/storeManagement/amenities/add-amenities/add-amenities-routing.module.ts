import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAmenitiesComponent } from './add-amenities/add-amenities.component';
const routes: Routes = [
  { path: '', component: AddAmenitiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAmenitiesRoutingModule { }
