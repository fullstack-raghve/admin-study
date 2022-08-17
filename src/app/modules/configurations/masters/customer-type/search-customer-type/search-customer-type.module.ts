import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchCustomerTypeRoutingModule } from './search-customer-type-routing.module';
import { SearchCustomerTypeComponent } from './search-customer-type/search-customer-type.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef
} from '@angular/material';
@NgModule({
  declarations: [SearchCustomerTypeComponent],
  imports: [
    CommonModule,
    SearchCustomerTypeRoutingModule,
    MatDialogModule,
    MatCardModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    SharedModule,
    MatTableModule
  ]
})
export class SearchCustomerTypeModule { }
