import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewFeedbackComponent } from './view-feedback/view-feedback.component';
const routes: Routes = [
    { path: '', component: ViewFeedbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewFeedbackRoutingModule { }
