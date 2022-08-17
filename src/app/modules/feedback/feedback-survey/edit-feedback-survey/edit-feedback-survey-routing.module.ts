import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditFeedbackSurveyComponent } from './edit-feedback-survey/edit-feedback-survey.component';

const routes: Routes = [
  {
    path: '',
    component: EditFeedbackSurveyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditFeedbackSurveyRoutingModule { }
