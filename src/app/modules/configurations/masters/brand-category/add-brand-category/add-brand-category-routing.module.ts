import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBrandCategoryComponent } from './add-brand-category/add-brand-category.component';
const routes: Routes = [
    {path:'', component: AddBrandCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBrandCategoryRoutingModule { }
