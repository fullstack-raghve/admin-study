import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedbackKioskReportsComponent } from './feedback-kiosk-reports/feedback-kiosk-reports.component';
const routes: Routes = [
  { path: '', component: FeedbackKioskReportsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackKioskReportsRoutingModule { }
