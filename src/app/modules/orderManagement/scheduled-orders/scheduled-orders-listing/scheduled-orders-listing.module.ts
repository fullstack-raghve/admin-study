import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduledOrdersListingRoutingModule } from './scheduled-orders-listing-routing.module';
import { ScheduledOrdersListingComponent } from './scheduled-orders-listing/scheduled-orders-listing.component';

import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
// import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ScheduledOrdersListingComponent],
  imports: [
    CommonModule,
    ScheduledOrdersListingRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class ScheduledOrdersListingModule { }
