import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditAssignPhysicalCardsComponent } from './edit-assign-physical-cards/edit-assign-physical-cards.component';
const routes: Routes = [{
  path:"",
  component:EditAssignPhysicalCardsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditAssignPhysicalCardsRoutingModule { }
