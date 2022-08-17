import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAssignPhysicalCardsComponent } from './view-assign-physical-cards/view-assign-physical-cards.component';

const routes: Routes = [{
  path:"",
  component:ViewAssignPhysicalCardsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewAssignPhysicalCardsRoutingModule { }
