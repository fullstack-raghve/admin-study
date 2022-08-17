import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchUploadedFilesComponent } from './search-uploaded-files/search-uploaded-files.component';
const routes: Routes = [
  {
    path: '',
    component: SearchUploadedFilesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchUploadedFilesRoutingModule { }
