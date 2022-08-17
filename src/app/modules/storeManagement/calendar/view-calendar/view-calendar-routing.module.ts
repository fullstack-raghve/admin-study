import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCalendarComponent } from './view-calendar/view-calendar.component';
const routes: Routes = [
  { path: '', component: ViewCalendarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCalendarRoutingModule { }
