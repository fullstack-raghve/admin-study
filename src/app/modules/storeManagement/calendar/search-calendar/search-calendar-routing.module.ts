import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCalendarComponent } from './search-calendar/search-calendar.component';

const routes: Routes = [
  { path: '', component: SearchCalendarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCalendarRoutingModule { }
