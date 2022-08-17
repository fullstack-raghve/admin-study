import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCategoryComponent } from './search-category/search-category.component';

const routes: Routes = [
    { path: '', component: SearchCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCategoryRoutingModule { }
