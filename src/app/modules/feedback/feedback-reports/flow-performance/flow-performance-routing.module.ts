import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlowPerformanceComponent } from './flow-performance/flow-performance.component';



const routes: Routes = [
  { path: '', component: FlowPerformanceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowPerformanceRoutingModule { }
