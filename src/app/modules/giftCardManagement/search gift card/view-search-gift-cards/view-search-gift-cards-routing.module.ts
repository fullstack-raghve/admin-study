import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewSearchGiftCardsComponent } from './view-search-gift-cards/view-search-gift-cards.component';

const routes: Routes = [{
  path:"",
  component:ViewSearchGiftCardsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewSearchGiftCardsRoutingModule { }
