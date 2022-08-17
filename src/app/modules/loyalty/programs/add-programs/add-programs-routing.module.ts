import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProgramsComponent } from './add-programs/add-programs.component';
const routes: Routes = [
    { path: '', component: AddProgramsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddProgramsRoutingModule { }
