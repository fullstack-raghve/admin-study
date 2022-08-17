import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchDeliveryAreaComponent } from './search-delivery-area/search-delivery-area.component';
const routes: Routes = [
  {path: '', component: SearchDeliveryAreaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchDeliveryAreaRoutingModule { }
