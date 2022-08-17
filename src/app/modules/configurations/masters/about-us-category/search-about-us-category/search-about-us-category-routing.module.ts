import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchAboutUsCategoryComponent } from './search-about-us-category/search-about-us-category.component';
const routes: Routes = [
    {path:'', component: SearchAboutUsCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchAboutUsCategoryRoutingModule { }
