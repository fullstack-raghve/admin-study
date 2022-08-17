import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCalendarComponent } from './add-calendar/add-calendar.component';
const routes: Routes = [
  { path: '', component: AddCalendarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCalendarRoutingModule { }
