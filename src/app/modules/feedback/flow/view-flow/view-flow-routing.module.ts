import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewFlowComponent } from './view-flow/view-flow.component';

const routes: Routes = [
  { path: '', component: ViewFlowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewFlowRoutingModule { }
