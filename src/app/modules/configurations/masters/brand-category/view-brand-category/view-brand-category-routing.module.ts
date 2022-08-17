import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBrandCategoryComponent } from './view-brand-category/view-brand-category.component';
const routes: Routes = [
    {path:'', component: ViewBrandCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewBrandCategoryRoutingModule { }
