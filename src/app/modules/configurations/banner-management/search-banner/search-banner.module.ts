
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchBannerRoutingModule } from './search-banner-routing.module';
import { SearchBannerComponent } from './search-banner/search-banner.component';

import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef, MatIconModule
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DndModule } from 'ngx-drag-drop';


@NgModule({
  declarations: [SearchBannerComponent],
  imports: [
    CommonModule,
    SearchBannerRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    MatIconModule,
    DragDropModule,
    DndModule,
  ],
})
export class SearchBannerModule { }
