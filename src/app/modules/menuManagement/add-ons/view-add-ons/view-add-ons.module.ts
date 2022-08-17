import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewAddOnsRoutingModule } from './view-add-ons-routing.module';
import { ViewAddOnsComponent } from './view-add-ons/view-add-ons.component';



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
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ViewAddOnsComponent],
  imports: [
    CommonModule,
    ViewAddOnsRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class ViewAddOnsModule { }
