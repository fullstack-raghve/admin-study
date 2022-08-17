import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchCuisineRoutingModule } from './search-cuisine-routing.module';
import { SearchCuisineComponent } from './search-cuisine/search-cuisine.component';
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
  declarations: [SearchCuisineComponent],
  imports: [
    CommonModule,
    SearchCuisineRoutingModule,
    MatDialogModule,
    MatCardModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    SharedModule,
    MatTableModule
  ]
})
export class SearchCuisineModule { }
