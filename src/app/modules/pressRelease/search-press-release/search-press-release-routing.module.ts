import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPressReleaseComponent } from './search-press-release/search-press-release.component';
const routes: Routes = [
    { path: '', component: SearchPressReleaseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchPressReleaseRoutingModule { }
