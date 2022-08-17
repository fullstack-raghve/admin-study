import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateFileUploadComponent } from './create-file-upload/create-file-upload.component';

const routes: Routes = [{
  path: '',
  component: CreateFileUploadComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateFileUploadRoutingModule { }
