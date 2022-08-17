import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchMallsComponent } from './search-malls/search-malls.component';
const routes: Routes = [
    {path:'', component: SearchMallsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchMallsRoutingModule { }
