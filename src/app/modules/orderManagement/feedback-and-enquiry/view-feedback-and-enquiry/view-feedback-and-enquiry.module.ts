import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewFeedbackAndEnquiryRoutingModule } from './view-feedback-and-enquiry-routing.module';
import { ViewFeedbackAndEnquiryComponent } from './view-feedback-and-enquiry/view-feedback-and-enquiry.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [ViewFeedbackAndEnquiryComponent],
  imports: [
    CommonModule,
    ViewFeedbackAndEnquiryRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule
  ]
})
export class ViewFeedbackAndEnquiryModule { }
