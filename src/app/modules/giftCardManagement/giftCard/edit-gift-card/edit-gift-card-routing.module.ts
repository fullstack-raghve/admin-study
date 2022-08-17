import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditGiftCardComponent } from './edit-gift-card/edit-gift-card.component';

const routes: Routes = [
  { path:'', component:EditGiftCardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditGiftCardRoutingModule { }
