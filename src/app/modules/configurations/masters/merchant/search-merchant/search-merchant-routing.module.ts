import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchMerchantComponent } from './search-merchant/search-merchant.component';

const routes: Routes = [
  {path:'',component:SearchMerchantComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchMerchantRoutingModule { }
