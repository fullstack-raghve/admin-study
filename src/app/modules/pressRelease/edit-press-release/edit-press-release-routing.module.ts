import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPressReleaseComponent } from './edit-press-release/edit-press-release.component';
const routes: Routes = [
    { path: '', component: EditPressReleaseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditPressReleaseRoutingModule { }
