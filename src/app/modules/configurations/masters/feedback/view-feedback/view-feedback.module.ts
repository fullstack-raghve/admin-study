import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewFeedbackRoutingModule } from './view-feedback-routing.module';
import { ViewFeedbackComponent } from './view-feedback/view-feedback.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewFeedbackComponent],
  imports: [
    CommonModule,
    ViewFeedbackRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ViewFeedbackModule { }
