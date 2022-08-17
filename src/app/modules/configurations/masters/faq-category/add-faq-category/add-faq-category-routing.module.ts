import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFaqCategoryComponent } from './add-faq-category/add-faq-category.component';
const routes: Routes = [
    {path:'', component: AddFaqCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddFaqCategoryRoutingModule { }
