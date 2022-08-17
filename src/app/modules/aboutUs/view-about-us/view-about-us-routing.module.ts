import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAboutUsComponent } from './view-about-us/view-about-us.component';
const routes: Routes = [
    { path: '', component: ViewAboutUsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewAboutUsRoutingModule { }
