import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddStoreRoutingModule } from './add-store-routing.module';
import { AddStoreComponent } from './add-store/add-store.component';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef, MatCell, MatCellDef
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
// import {MatTableModule} from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
  declarations: [AddStoreComponent],
  imports: [
    CommonModule,
    AddStoreRoutingModule,
    CommonModule,
    SharedModule,
    MatAutocompleteModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MalihuScrollbarModule,
    MatChipsModule
  ]
})
export class AddStoreModule { }
