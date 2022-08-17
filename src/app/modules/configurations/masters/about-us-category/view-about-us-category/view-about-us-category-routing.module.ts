import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAboutUsCategoryComponent } from './view-about-us-category/view-about-us-category.component';
const routes: Routes = [
    {path:'', component: ViewAboutUsCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewAboutUsCategoryRoutingModule { }
