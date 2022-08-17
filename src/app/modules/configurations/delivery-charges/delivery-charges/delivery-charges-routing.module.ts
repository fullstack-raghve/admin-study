import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryChargesComponent } from './delivery-charges/delivery-charges.component';
const routes: Routes = [
    {path:'', component:DeliveryChargesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryChargesRoutingModule { }