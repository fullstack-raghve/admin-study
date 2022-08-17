import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddGiftingComponent } from './add-gifting/add-gifting.component';

const routes: Routes = [
  {
    path: '',
    component: AddGiftingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddGiftingRoutingModule { }
