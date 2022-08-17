import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAddOnsComponent } from './view-add-ons/view-add-ons.component';

const routes: Routes = [
  { path: '', component: ViewAddOnsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewAddOnsRoutingModule { }
