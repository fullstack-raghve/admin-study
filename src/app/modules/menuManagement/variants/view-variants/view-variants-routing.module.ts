import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewVariantsComponent } from './view-variants/view-variants.component';

const routes: Routes = [
  { path: '', component: ViewVariantsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewVariantsRoutingModule { }
