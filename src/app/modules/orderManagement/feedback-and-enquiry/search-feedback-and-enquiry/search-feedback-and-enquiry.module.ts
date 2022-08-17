import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchFeedbackAndEnquiryRoutingModule } from './search-feedback-and-enquiry-routing.module';
import { SearchFeedbackAndEnquiryComponent } from './search-feedback-and-enquiry/search-feedback-and-enquiry.component';

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

@NgModule({
  declarations: [SearchFeedbackAndEnquiryComponent],
  imports: [
    CommonModule,
    SearchFeedbackAndEnquiryRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class SearchFeedbackAndEnquiryModule { }
