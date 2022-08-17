import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAddOnsComponent } from './add-add-ons/add-add-ons.component';

const routes: Routes = [
  { path: '', component: AddAddOnsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAddOnsRoutingModule { }
