import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchCourseRoutingModule } from './search-course-routing.module';
import { SearchCourseComponent } from './search-course/search-course.component';
import { SharedModule } from '../../../../../shared/shared.module';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
// import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchCourseComponent],
  imports: [
    CommonModule,
    SearchCourseRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    CdkTableModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule
  ]
})
export class SearchCourseModule { }
