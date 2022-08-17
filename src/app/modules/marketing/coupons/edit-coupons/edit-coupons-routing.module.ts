import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCouponsComponent } from './edit-coupons/edit-coupons.component';
const routes: Routes = [
    { path: '', component: EditCouponsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCouponsRoutingModule { }
