import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewFeedbackSurveyComponent } from './view-feedback-survey/view-feedback-survey.component';

const routes: Routes = [
  {path:'',component:ViewFeedbackSurveyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewFeedbackSurveyRoutingModule { }
