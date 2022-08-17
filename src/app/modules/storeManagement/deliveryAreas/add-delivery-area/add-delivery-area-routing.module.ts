import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDeliveryAreaComponent } from './add-delivery-area/add-delivery-area.component';
const routes: Routes = [
  {path: '', component: AddDeliveryAreaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddDeliveryAreaRoutingModule { }
