import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KioskReportComponent } from './kiosk-report/kiosk-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { KioskReportRoutingModule } from './kiosk-report-routing.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
// import { KioskReportRoutingModule } from './kiosk-report-routing.module';

@NgModule({
  declarations: [KioskReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    KioskReportRoutingModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class KioskReportModule { }
