import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCourseRoutingModule } from './view-course-routing.module';
import { ViewCourseComponent } from './view-course/view-course.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [ViewCourseComponent],
  imports: [
    CommonModule,
    ViewCourseRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewCourseModule { }
