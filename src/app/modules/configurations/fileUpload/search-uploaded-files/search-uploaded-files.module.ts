import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchUploadedFilesRoutingModule } from './search-uploaded-files-routing.module';
import { SearchUploadedFilesComponent } from './search-uploaded-files/search-uploaded-files.component';

import { MatTableModule } from '@angular/material';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  declarations: [SearchUploadedFilesComponent],
  imports: [
    CommonModule,
    SearchUploadedFilesRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule,
    CdkTableModule,
    MatTableModule,
    ReactiveFormsModule
  ]
})
export class SearchUploadedFilesModule { }
