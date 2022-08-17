import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchAboutUsComponent } from './search-about-us/search-about-us.component';
const routes: Routes = [
    { path: '', component: SearchAboutUsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchAboutUsRoutingModule { }
