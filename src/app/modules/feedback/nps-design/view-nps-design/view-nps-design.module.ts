import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewNpsDesignRoutingModule } from './view-nps-design-routing.module';
import { ViewNpsDesignComponent } from './view-nps-design/view-nps-design.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewNpsDesignComponent],
  imports: [
    CommonModule,
    ViewNpsDesignRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ]
})
export class ViewNpsDesignModule { }
