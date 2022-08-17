import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

import { AddFeedbackSurveyRoutingModule } from './add-feedback-survey-routing.module';
import { AddFeebackSurveyComponent } from './add-feeback-survey/add-feeback-survey.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@NgModule({
  declarations: [AddFeebackSurveyComponent],
  imports: [
    CommonModule,
    AddFeedbackSurveyRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
  ],
})
export class AddFeedbackSurveyModule { }
