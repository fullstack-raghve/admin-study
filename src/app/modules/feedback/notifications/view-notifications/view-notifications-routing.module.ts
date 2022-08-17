import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewNotificationComponent } from './view-notification/view-notification.component';

const routes: Routes = [
  {path:'', component: ViewNotificationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewNotificationsRoutingModule { }
