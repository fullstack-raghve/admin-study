import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTemplateComponent } from './view-template/view-template.component';
const routes: Routes = [
    { path: '', component: ViewTemplateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewTemplateRoutingModule { }
