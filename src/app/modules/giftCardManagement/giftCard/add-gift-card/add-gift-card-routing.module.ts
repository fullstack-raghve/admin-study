import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddGiftCardComponent } from './add-gift-card/add-gift-card.component';

const routes: Routes = [
  { path:'', component:AddGiftCardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddGiftCardRoutingModule { }
