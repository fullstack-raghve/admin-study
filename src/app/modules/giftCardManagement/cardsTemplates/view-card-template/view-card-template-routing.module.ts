import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCardTemplateComponent } from './view-card-template/view-card-template.component';
const routes: Routes = [
  {path: '', component: ViewCardTemplateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCardTemplateRoutingModule { }
