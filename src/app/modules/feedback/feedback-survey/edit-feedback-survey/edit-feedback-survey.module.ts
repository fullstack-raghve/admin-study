import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditFeedbackSurveyRoutingModule } from './edit-feedback-survey-routing.module';
import { EditFeedbackSurveyComponent } from './edit-feedback-survey/edit-feedback-survey.component';

import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule,MatTableModule, MatPaginatorModule,MatDialogModule } from '@angular/material';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [EditFeedbackSurveyComponent],
  imports: [
    CommonModule,
    EditFeedbackSurveyRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
    MatExpansionModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class EditFeedbackSurveyModule { }
