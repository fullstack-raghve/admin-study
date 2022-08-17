import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchProgramsComponent } from './search-programs/search-programs.component';
const routes: Routes = [
    { path: '', component: SearchProgramsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchProgramsRoutingModule { }
