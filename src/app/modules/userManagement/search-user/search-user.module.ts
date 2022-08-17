import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchUserRoutingModule } from './search-user-routing.module';
import { SearchUserComponent } from './search-user/search-user.component';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader,MatSortModule, MatRow, MatRowDef,  MatCell, MatCellDef
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
// import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ResetPinComponent } from './reset-pin/reset-pin.component';

@NgModule({
  declarations: [SearchUserComponent,ResetPinComponent],
  imports: [
    MatInputModule,
    CommonModule,
    SearchUserRoutingModule,
    CommonModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSortModule,
    MatAutocompleteModule
  ],
  entryComponents: [
    ResetPinComponent
  ]
})
export class SearchUserModule { }
