import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchGiftCardComponent } from './search-gift-card/search-gift-card.component';

const routes: Routes =[
  { path:'', component:SearchGiftCardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchGiftCardRoutingModule { }
