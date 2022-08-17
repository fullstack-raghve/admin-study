import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCourseComponent } from './search-course/search-course.component';

const routes: Routes = [
  {path : '',component : SearchCourseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCourseRoutingModule { }
