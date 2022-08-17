import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProgramsComponent } from './edit-programs/edit-programs.component';
const routes: Routes = [
    { path: '', component: EditProgramsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProgramsRoutingModule { }
