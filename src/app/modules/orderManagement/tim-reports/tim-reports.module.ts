import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimReportsRoutingModule } from './tim-reports-routing.module';
import { TimReportsComponent } from './tim-reports/tim-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [TimReportsComponent],
  imports: [
    CommonModule,
    TimReportsRoutingModule,
    SharedModule,
    MatCardModule,
    MatInputModule,
  ]
})
export class TimReportsModule { }
