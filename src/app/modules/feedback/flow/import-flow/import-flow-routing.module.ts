import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportFlowComponent } from './import-flow/import-flow.component';
const routes: Routes = [
  { path:'', component: ImportFlowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportFlowRoutingModule { }
