
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditBannerRoutingModule } from './edit-banner-routing.module';
import { EditBannerComponent } from './edit-banner/edit-banner.component';

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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [EditBannerComponent],
  imports: [
    CommonModule,
    EditBannerRoutingModule,
    MatAutocompleteModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
})
export class EditBannerModule { }
