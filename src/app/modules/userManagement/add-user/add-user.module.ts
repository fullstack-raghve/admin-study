import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { AddUserRoutingModule } from './add-user-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef, MatSlideToggleModule
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddUserComponent,

  ],
  imports: [
    CommonModule,
    AddUserRoutingModule,
    MatAutocompleteModule,
    SharedModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSlideToggleModule,
  ],
  entryComponents: [AddUserComponent],
})
export class AddUserModule { }
