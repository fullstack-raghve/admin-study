import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCourseRoutingModule } from './edit-course-routing.module';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule, MatTableModule, MatAutocompleteModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [EditCourseComponent],
  imports: [
    CommonModule,
    EditCourseRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    MatAutocompleteModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditCourseModule { }
