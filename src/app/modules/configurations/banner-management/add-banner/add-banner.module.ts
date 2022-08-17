
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBannerRoutingModule } from './add-banner-routing.module';
import { AddBannerComponent } from './add-banner/add-banner.component';

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
  declarations: [AddBannerComponent],
  imports: [
    CommonModule,
    AddBannerRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
})
export class AddBannerModule { }
