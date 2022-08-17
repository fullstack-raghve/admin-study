import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCourseRoutingModule } from './add-course-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule, MatTableModule, MatAutocompleteModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [AddCourseComponent],
  imports: [
    CommonModule,
    AddCourseRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class AddCourseModule { }
