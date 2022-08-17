import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionListingRoutingModule } from './transaction-listing-routing.module';
import { TransactionListingComponent } from './transaction-listing/transaction-listing.component';

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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [TransactionListingComponent],
  imports: [
    CommonModule,
    TransactionListingRoutingModule,
    SharedModule,
    MatAutocompleteModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class TransactionListingModule { }
