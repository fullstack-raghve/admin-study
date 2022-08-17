import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCalendarComponent } from './edit-calendar/edit-calendar.component';
const routes: Routes = [
  { path: '', component: EditCalendarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCalendarRoutingModule { }
