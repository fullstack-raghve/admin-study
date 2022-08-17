import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditAboutUsComponent } from './edit-about-us/edit-about-us.component';
const routes: Routes = [
    { path: '', component: EditAboutUsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditAboutUsRoutingModule { }
