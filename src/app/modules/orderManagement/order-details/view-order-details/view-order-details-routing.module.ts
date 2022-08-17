import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewOrderDetailsComponent } from './view-order-details/view-order-details.component';
const routes: Routes = [
  { path: '', component: ViewOrderDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewOrderDetailsRoutingModule { }
