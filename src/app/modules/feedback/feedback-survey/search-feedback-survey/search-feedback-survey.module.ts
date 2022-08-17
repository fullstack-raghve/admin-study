import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchFeedbackSurveyRoutingModule } from './search-feedback-survey-routing.module';
import { SearchFeebackSurveyComponent } from './search-feeback-survey/search-feeback-survey.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [SearchFeebackSurveyComponent],
  imports: [
    CommonModule,
    SearchFeedbackSurveyRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule
  ]
})
export class SearchFeedbackSurveyModule { }
