import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditDeliveryAreaComponent } from './edit-delivery-area/edit-delivery-area.component';
const routes: Routes = [
  { path: '', component: EditDeliveryAreaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditDeliveryAreaRoutingModule { }
