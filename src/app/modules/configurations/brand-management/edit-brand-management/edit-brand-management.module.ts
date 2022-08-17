import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { EditBrandRoutingModule } from './edit-brand-management-routing.module';
import { EditBrandComponent } from './edit-brand-management/edit-brand-management.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule }   from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatCardModule, MatPaginatorModule, MatDialogModule, MatTabsModule } from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@NgModule({
  declarations: [EditBrandComponent],
  imports: [
    CommonModule,
    EditBrandRoutingModule,
    // MatChipInputEvent,
    SharedModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    CdkTableModule,
    MatPaginatorModule,
    NgxMatSelectSearchModule,
    SelectAutocompleteModule,
    MatAutocompleteModule,
    // COMMA,
    // ENTER,
    ReactiveFormsModule,
    MatDialogModule,
    EditorModule
  ]
})
export class EditBrandModule { }