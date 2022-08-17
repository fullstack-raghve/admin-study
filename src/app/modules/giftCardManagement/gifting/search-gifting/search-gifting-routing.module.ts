import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchGiftingComponent } from './search-gifting/search-gifting.component';
const routes: Routes = [{
  path:"",
  component:SearchGiftingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchGiftingRoutingModule { }
