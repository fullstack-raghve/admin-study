import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProductsComponent } from './add-products/add-products.component';
const routes: Routes = [
    { path: '', component: AddProductsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddProductsRoutingModule { }
