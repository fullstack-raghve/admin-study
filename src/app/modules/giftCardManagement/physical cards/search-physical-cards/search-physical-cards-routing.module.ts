import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPhysicalCardsComponent } from './search-physical-cards/search-physical-cards.component';
const routes: Routes = [{
  path:"",
  component:SearchPhysicalCardsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchPhysicalCardsRoutingModule { }
