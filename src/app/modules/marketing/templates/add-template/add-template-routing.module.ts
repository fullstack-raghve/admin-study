import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTemplateComponent } from './add-template/add-template.component';
const routes: Routes = [
    { path: '', component: AddTemplateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTemplateRoutingModule { }
