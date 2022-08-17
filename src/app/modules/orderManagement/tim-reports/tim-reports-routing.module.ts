import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimReportsComponent } from './tim-reports/tim-reports.component';

const routes: Routes = [
  { path: '', component: TimReportsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimReportsRoutingModule { }
