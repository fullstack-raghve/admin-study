import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProductTagComponent } from './add-product-tag/add-product-tag.component';

const routes: Routes = [
  { path: '', component: AddProductTagComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddProductTagRoutingModule { }
