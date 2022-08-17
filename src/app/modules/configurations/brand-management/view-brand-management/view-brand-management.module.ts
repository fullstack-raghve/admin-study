import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewBrandRoutingModule } from './view-brand-management-routing.module';
import { ViewBrandComponent } from './view-brand-management/view-brand-management.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule }   from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatCardModule, MatPaginatorModule, MatDialogModule, MatTabsModule } from '@angular/material';
@NgModule({
  declarations: [ViewBrandComponent],
  imports: [
    CommonModule,
    ViewBrandRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    EditorModule
  ]
})
export class ViewBrandModule { }