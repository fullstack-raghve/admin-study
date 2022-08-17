import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchAddOnsRoutingModule } from './search-add-ons-routing.module';
import { SearchAddOnsComponent } from './search-add-ons/search-add-ons.component';

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
@NgModule({
  declarations: [SearchAddOnsComponent],
  imports: [
      CommonModule,
      SearchAddOnsRoutingModule,
      SharedModule,
      MatCardModule,
      MatTableModule,
      CdkTableModule,
      MatPaginatorModule,
      ReactiveFormsModule,
      MatDialogModule
    ]
})
export class SearchAddOnsModule { }
