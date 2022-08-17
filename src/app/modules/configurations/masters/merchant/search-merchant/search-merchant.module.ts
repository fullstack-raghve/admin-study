import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchMerchantRoutingModule } from './search-merchant-routing.module';
import { SearchMerchantComponent } from './search-merchant/search-merchant.component';
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
  declarations: [SearchMerchantComponent],
  imports: [
    CommonModule,
    SearchMerchantRoutingModule,
    MatDialogModule,
    MatCardModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    SharedModule,
    MatTableModule
  ]
})
export class SearchMerchantModule { }
