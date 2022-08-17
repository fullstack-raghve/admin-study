import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchBrandsComponent } from './search-brands/search-brands.component';
const routes: Routes = [
    {path:'', component: SearchBrandsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchBrandsRoutingModule { }
