import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCourseComponent } from './view-course/view-course.component';

const routes: Routes = [
  {path : '',component : ViewCourseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCourseRoutingModule { }
