import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewProgramsRoutingModule } from './view-programs-routing.module';
import { ViewProgramsComponent } from './view-programs/view-programs.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef,MatSortModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewProgramsComponent],
  imports: [
    CommonModule,
    ViewProgramsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule,
    CdkTableModule,
    MatPaginatorModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatSortModule
  ]
})
export class ViewProgramsModule { }
