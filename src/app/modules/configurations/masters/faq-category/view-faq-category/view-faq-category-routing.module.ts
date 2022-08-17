import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewFaqCategoryComponent } from './view-faq-category/view-faq-category.component';
const routes: Routes = [
    {path:'', component: ViewFaqCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewFaqCategoryRoutingModule { }
