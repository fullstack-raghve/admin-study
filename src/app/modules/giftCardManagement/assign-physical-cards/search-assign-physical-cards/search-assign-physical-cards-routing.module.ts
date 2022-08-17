import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchAssignPhysicalCardsComponent } from './search-assign-physical-cards/search-assign-physical-cards.component';
const routes: Routes = [{
  path:"",
  component:SearchAssignPhysicalCardsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchAssignPhysicalCardsRoutingModule { }
