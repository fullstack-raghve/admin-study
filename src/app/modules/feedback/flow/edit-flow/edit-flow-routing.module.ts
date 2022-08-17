import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditFlowComponent } from './edit-flow/edit-flow.component';

const routes: Routes = [
  { path: '', component: EditFlowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditFlowRoutingModule { }
