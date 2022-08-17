import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditNotificationsComponent } from './edit-notifications/edit-notifications.component';
const routes: Routes = [
    { path: '', component: EditNotificationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditNotificationsRoutingModule { }
