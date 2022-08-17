import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncompleteReportsRoutingModule } from './incomplete-reports-routing.module';
import { IncompleteReportsComponent } from './incomplete-reports/incomplete-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [IncompleteReportsComponent],
  imports: [
    CommonModule,
    IncompleteReportsRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class IncompleteReportsModule { }
