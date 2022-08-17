import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchEnquiriesRoutingModule } from './search-enquiries-routing.module';
import { SearchEnquiriesComponent } from './search-enquiries/search-enquiries.component';
import { MatTableModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import {AddEnquiryDialogComponent} from './add-enquiry-dialog/add-enquiry-dialog.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [SearchEnquiriesComponent,AddEnquiryDialogComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    SearchEnquiriesRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  entryComponents: [
    AddEnquiryDialogComponent
  ]
})
export class SearchEnquiriesModule { }
