import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditBrandsComponent } from './edit-brands/edit-brands.component';
const routes: Routes = [
    { path:'', component: EditBrandsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditBrandsRoutingModule { }
