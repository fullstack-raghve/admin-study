import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditAboutUsCategoryComponent } from './edit-about-us-category/edit-about-us-category.component';
const routes: Routes = [
    {path:'', component: EditAboutUsCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditAboutUsCategoryRoutingModule { }
