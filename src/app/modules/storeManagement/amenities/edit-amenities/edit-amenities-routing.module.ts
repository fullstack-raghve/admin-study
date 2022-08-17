import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditAmenitiesComponent } from './edit-amenities/edit-amenities.component';
const routes: Routes = [
  { path: '', component: EditAmenitiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditAmenitiesRoutingModule { }
