import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchEventsComponent } from './search-events/search-events.component';

const routes: Routes = [
   { path: '', component: SearchEventsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchEventsRoutingModule { }
