import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEventsComponent } from './add-events/add-events.component';

const routes: Routes = [
  { path: '', component: AddEventsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEventsRoutingModule { }
