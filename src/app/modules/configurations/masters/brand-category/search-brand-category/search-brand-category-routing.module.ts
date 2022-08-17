import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchBrandCategoryComponent } from './search-brand-category/search-brand-category.component';
const routes: Routes = [
    {path:'', component: SearchBrandCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchBrandCategoryRoutingModule { }
