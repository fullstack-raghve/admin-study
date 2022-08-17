import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewNotificationsComponent } from './view-notifications/view-notifications.component';
const routes: Routes = [
    { path: '', component: ViewNotificationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewNotificationsRoutingModule { }
