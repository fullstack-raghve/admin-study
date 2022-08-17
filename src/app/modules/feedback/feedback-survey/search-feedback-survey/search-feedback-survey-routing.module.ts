import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFeebackSurveyComponent } from './search-feeback-survey/search-feeback-survey.component';
//import { SearchFeedbackComponent } from 'src/app/modules/configurations/masters/feedback/search-feedback/search-feedback/search-feedback.component';

const routes: Routes = [
{ path: '', component: SearchFeebackSurveyComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchFeedbackSurveyRoutingModule { }
