import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewEventsComponent } from './view-events/view-events.component';

const routes: Routes = [
  { path: '', component: ViewEventsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEventsRoutingModule { }
