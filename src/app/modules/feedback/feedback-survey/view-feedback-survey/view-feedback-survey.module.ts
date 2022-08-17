import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewFeedbackSurveyRoutingModule } from './view-feedback-survey-routing.module';
import { ViewFeedbackSurveyComponent } from './view-feedback-survey/view-feedback-survey.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule,MatTableModule } from '@angular/material';
@NgModule({
  declarations: [ViewFeedbackSurveyComponent],
  imports: [
    CommonModule,
    ViewFeedbackSurveyRoutingModule,
    SharedModule,
    MatDialogModule,
    MatTableModule
  ]
})
export class ViewFeedbackSurveyModule { }
