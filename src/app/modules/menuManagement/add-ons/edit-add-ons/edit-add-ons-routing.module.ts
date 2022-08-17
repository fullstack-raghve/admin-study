import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditAddOnsComponent } from './edit-add-ons/edit-add-ons.component';

const routes: Routes = [
  { path: '', component: EditAddOnsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditAddOnsRoutingModule { }
