import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchSearchGiftCardsComponent } from './search-search-gift-cards/search-search-gift-cards.component';

const routes: Routes = [{
  path:"",
  component:SearchSearchGiftCardsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchSearchGiftCardRoutingModule { }
