import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewScheduledOrderDetailsComponent } from './view-scheduled-order-details/view-scheduled-order-details.component';

const routes: Routes = [
  { path: '', component: ViewScheduledOrderDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewScheduledOrderDetailsRoutingModule { }
