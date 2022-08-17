import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchNotificationsComponent } from './search-notifications/search-notifications.component';
const routes: Routes = [
    { path: '', component: SearchNotificationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchNotificationsRoutingModule { }
