import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowPerformanceComponent } from './flow-performance/flow-performance.component';
import { FlowPerformanceRoutingModule } from './flow-performance-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FlowPerformanceComponent],
  imports: [
    CommonModule,
    SharedModule,
    FlowPerformanceRoutingModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class FlowPerformanceModule { }
