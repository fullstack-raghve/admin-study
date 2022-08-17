import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewEventGiftingComponent } from './view-event-gifting/view-event-gifting.component';
const routes: Routes = [
  { path:'', component:ViewEventGiftingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEventGiftingRoutingModule { }
