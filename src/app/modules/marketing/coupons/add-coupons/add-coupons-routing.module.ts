import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCouponsComponent } from './add-coupons/add-coupons.component';

const routes: Routes = [
    { path: '', component: AddCouponsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCouponsRoutingModule { }
