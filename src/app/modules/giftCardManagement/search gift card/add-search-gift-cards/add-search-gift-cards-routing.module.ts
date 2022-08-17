import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSearchGiftCardsComponent } from './add-search-gift-cards/add-search-gift-cards.component';

const routes: Routes = [{
  path:"",
  component:AddSearchGiftCardsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSearchGiftCardsRoutingModule { }
