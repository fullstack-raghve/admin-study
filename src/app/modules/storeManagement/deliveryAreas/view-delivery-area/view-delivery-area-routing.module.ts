import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewDeliveryAreaComponent } from './view-delivery-area/view-delivery-area.component';
const routes: Routes = [
  { path: '', component: ViewDeliveryAreaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewDeliveryAreaRoutingModule { }
