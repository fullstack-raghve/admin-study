import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncompleteReportsComponent } from './incomplete-reports/incomplete-reports.component';
const routes: Routes = [
  { path: '' , component: IncompleteReportsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncompleteReportsRoutingModule { }
