import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchCouponsRoutingModule } from './search-coupons-routing.module';
import { SearchCouponsComponent } from './search-coupons/search-coupons.component';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material';
@NgModule({
  declarations: [SearchCouponsComponent],
  imports: [
    CommonModule,
    SearchCouponsRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class SearchCouponsModule { }
