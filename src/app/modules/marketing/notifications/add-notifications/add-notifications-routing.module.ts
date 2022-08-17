import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNotificationsComponent } from './add-notifications/add-notifications.component';
const routes: Routes = [
    { path: '', component: AddNotificationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddNotificationsRoutingModule { }
