import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditFaqCategoryComponent } from './edit-faq-category/edit-faq-category.component';
const routes: Routes = [
    {path:'', component: EditFaqCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditFaqCategoryRoutingModule { }
