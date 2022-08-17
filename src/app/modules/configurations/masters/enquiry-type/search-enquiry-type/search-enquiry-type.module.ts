import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchEnquiryTypeRoutingModule } from './search-enquiry-type-routing.module';
import { SearchEnquiryTypeComponent } from './search-enquiry-type/search-enquiry-type.component';
import { SharedModule } from '../../../../../shared/shared.module';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef, MatSortModule, MatInputModule
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
// import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [SearchEnquiryTypeComponent],
  imports: [
    CommonModule,
    SearchEnquiryTypeRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,

  ]
})
export class SearchEnquiryTypeModule { }
