import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchCustomerSegmentsRoutingModule } from './search-customer-segments-routing.module';
import { SearchCustomerSegmentsComponent } from './search-customer-segments/search-customer-segments.component';

import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef, MatSortModule
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchCustomerSegmentsComponent],
  imports: [
    CommonModule,
    SearchCustomerSegmentsRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSortModule
  ]
})
export class SearchCustomerSegmentsModule { }
