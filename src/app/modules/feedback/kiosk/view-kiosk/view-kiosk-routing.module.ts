import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewKioskComponent } from './view-kiosk/view-kiosk.component';

const routes: Routes = [
  { path: '', component: ViewKioskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewKioskRoutingModule { }
