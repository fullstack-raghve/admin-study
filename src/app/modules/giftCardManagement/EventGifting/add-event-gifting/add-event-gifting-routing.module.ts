import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEventGiftingComponent } from './add-event-gifting/add-event-gifting.component';

const routes: Routes = [
  { path:'', component:AddEventGiftingComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEventGiftingRoutingModule { }
