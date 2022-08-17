import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddKioskComponent } from './add-kiosk/add-kiosk.component';
const routes: Routes = [
  { path: '', component: AddKioskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddKioskRoutingModule { }
