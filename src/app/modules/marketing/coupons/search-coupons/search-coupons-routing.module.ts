import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCouponsComponent } from './search-coupons/search-coupons.component';
const routes: Routes = [
    { path: '', component: SearchCouponsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCouponsRoutingModule { }
