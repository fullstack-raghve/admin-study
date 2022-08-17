import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewPressReleaseComponent } from './view-press-release/view-press-release.component';
const routes: Routes = [
    { path: '', component: ViewPressReleaseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewPressReleaseRoutingModule { }
