import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackKioskReportsRoutingModule } from './feedback-kiosk-reports-routing.module';
import { FeedbackKioskReportsComponent } from './feedback-kiosk-reports/feedback-kiosk-reports.component';
import { SharedModule } from '../../../shared/shared.module';
@NgModule({
  declarations: [FeedbackKioskReportsComponent],
  imports: [
    CommonModule,
    FeedbackKioskReportsRoutingModule,
    SharedModule
  ]
})
export class FeedbackKioskReportsModule { }
