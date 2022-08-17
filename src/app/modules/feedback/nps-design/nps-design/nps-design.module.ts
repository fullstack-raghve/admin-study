import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NpsDesignRoutingModule } from './nps-design-routing.module';
import { NpsDesignComponent } from './nps-design/nps-design.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [NpsDesignComponent],
  imports: [
    CommonModule,
    NpsDesignRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ]
})
export class NpsDesignModule { }
