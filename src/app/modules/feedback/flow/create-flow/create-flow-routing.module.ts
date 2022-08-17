import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateFlowComponent } from './create-flow/create-flow.component';

const routes: Routes = [
  { path: '', component: CreateFlowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateFlowRoutingModule { }
