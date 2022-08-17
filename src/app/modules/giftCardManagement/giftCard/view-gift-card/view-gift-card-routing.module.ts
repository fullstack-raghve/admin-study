import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewGiftCardComponent } from './view-gift-card/view-gift-card.component';

const routes: Routes = [
  { path:'', component:ViewGiftCardComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewGiftCardRoutingModule { }
