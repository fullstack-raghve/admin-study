import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateFileGalleryComponent } from './create-file-gallery/create-file-gallery.component';


const routes: Routes = [{
  path: '',
  component: CreateFileGalleryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateFileGalleryRoutingModule { }
