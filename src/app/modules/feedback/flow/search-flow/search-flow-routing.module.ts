import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFlowComponent } from './search-flow/search-flow.component';

const routes: Routes = [
  { path: '', component: SearchFlowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchFlowRoutingModule { }
