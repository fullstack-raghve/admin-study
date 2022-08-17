import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAssignPhysicalCardsComponent } from './add-assign-physical-cards/add-assign-physical-cards.component';
const routes: Routes = [{
  path:"",
  component:AddAssignPhysicalCardsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAssignPhysicalCardsRoutingModule { }
