import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeedbackReportRoutingModule } from './feedback-report-routing.module';
import { FeedbackReportComponent } from './feedback-report/feedback-report.component';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [FeedbackReportComponent],
  imports: [
    CommonModule,
    FeedbackReportRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class FeedbackReportModule { }
