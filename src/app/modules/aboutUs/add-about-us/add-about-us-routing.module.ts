import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAboutUsComponent } from './add-about-us/add-about-us.component';
const routes: Routes = [
    { path: '', component: AddAboutUsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAboutUsRoutingModule { }
