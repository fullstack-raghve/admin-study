import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedbackReportComponent } from './feedback-report/feedback-report.component';



const routes: Routes = [
  { path: '', component: FeedbackReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackReportRoutingModule { }
