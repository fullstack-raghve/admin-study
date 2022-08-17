import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProductsComponent } from './edit-products/edit-products.component';
const routes: Routes = [
    { path: '', component: EditProductsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProductsRoutingModule { }
