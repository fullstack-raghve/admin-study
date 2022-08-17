import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditBrandCategoryComponent } from './edit-brand-category/edit-brand-category.component';
const routes: Routes = [
    {path:'', component: EditBrandCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditBrandCategoryRoutingModule { }
