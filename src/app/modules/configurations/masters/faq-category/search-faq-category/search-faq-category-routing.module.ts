import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFaqCategoryComponent } from './search-faq-category/search-faq-category.component';
const routes: Routes = [
    {path:'', component: SearchFaqCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchFaqCategoryRoutingModule { }
