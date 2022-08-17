import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewMerchantComponent } from './view-merchant/view-merchant.component';

const routes: Routes = [
  {path:'',component:ViewMerchantComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewMerchantRoutingModule { }
