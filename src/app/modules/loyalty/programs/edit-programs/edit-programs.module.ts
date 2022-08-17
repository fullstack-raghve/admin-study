import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProgramsRoutingModule } from './edit-programs-routing.module';
import { EditProgramsComponent } from './edit-programs/edit-programs.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditProgramsComponent],
  imports: [
    CommonModule,
    EditProgramsRoutingModule,
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
    MatTableModule
  ]
})
export class EditProgramsModule { }
