import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchKioskAlertsRoutingModule } from './search-kiosk-alerts-routing.module';
import { SearchKioskAlertsComponent } from './search-kiosk-alerts/search-kiosk-alerts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchKioskAlertsComponent],
  imports: [
    CommonModule,
    SearchKioskAlertsRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class SearchKioskAlertsModule { }
