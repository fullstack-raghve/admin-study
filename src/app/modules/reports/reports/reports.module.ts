import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { MatTableModule } from '@angular/material';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule,
    CdkTableModule,
    MatTableModule,
    ReactiveFormsModule
  ]
})
export class ReportsModule { }
