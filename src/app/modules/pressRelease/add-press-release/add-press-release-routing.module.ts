import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPressReleaseComponent } from './add-press-release/add-press-release.component';
const routes: Routes = [
    { path: '', component: AddPressReleaseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPressReleaseRoutingModule { }
