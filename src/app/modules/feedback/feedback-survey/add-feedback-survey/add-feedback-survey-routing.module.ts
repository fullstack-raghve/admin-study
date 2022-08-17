import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFeebackSurveyComponent } from './add-feeback-survey/add-feeback-survey.component';

const routes: Routes = [
  { path: '', component: AddFeebackSurveyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddFeedbackSurveyRoutingModule { }
