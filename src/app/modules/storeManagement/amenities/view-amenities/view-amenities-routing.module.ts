import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAmenitiesComponent } from './view-amenities/view-amenities.component';
const routes: Routes = [
  { path: '', component: ViewAmenitiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewAmenitiesRoutingModule { }
