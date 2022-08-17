import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditGiftingComponent } from './edit-gifting/edit-gifting.component';
const routes: Routes = [
  {
    path:"",
    component:EditGiftingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditGiftingRoutingModule { }
