import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchBrandRoutingModule } from './search-brand-routing.module';
import { SearchBrandComponent } from './search-brand/search-brand.component';
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
  declarations: [SearchBrandComponent],
  imports: [
    CommonModule,
    SearchBrandRoutingModule,
    MatDialogModule,
    MatCardModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    SharedModule,
    MatTableModule
  ]
})
export class SearchBrandModule { }
