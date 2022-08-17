import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewLocationComponent } from './view-location/view-location.component';

const routes: Routes = [
  { path: '', component: ViewLocationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewLocationRoutingModule { }
