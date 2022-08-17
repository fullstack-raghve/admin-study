import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewProgramsComponent } from './view-programs/view-programs.component';
const routes: Routes = [
    { path: '', component:ViewProgramsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewProgramsRoutingModule { }
