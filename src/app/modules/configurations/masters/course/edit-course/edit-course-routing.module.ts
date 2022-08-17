import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCourseComponent } from './edit-course/edit-course.component';

const routes: Routes = [
  { path : '' , component : EditCourseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCourseRoutingModule { }
