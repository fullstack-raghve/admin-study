import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditSearchGiftCardsComponent } from './edit-search-gift-cards/edit-search-gift-cards.component';
const routes: Routes = [{
  path:"",
  component:EditSearchGiftCardsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditSearchGiftCardsRoutingModule { }
