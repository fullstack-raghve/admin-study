import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAboutUsCategoryComponent } from './add-about-us-category/add-about-us-category.component';
const routes: Routes = [
    {path:'', component: AddAboutUsCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAboutUsCategoryRoutingModule { }
