import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppDeliveryComponent } from './app-delivery/app-delivery.component';

const routes: Routes = [
  { path: '', component: AppDeliveryComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppDeliveryRoutingModule { }
