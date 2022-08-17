import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchCitiesRoutingModule } from './search-cities-routing.module';
import { SearchCitiesComponent } from './search-cities/search-cities.component';
import { SharedModule } from '../../../../../shared/shared.module';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
// import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [SearchCitiesComponent],
  imports: [
    CommonModule,
    SearchCitiesRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule
  ]
})
export class SearchCitiesModule { }
