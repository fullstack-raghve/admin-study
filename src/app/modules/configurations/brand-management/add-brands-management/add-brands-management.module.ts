import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {MatDialogModule} from '@angular/material/dialog';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { AddBrandsRoutingModule } from './add-brands-management-routing.module';
import { AddBrandsComponent } from './add-brands-management/add-brands-management.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [AddBrandsComponent],
  imports: [
    CommonModule,
    AddBrandsRoutingModule,
    MatAutocompleteModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    SelectAutocompleteModule,
    EditorModule
  ]
})
export class AddBrandsModule { }