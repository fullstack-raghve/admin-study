import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveOrdersGlobalSearchComponent } from './live-orders-global-search/live-orders-global-search.component';


const routes: Routes = [ 
  { path: '', component : LiveOrdersGlobalSearchComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveOrdersGlobalSearchRoutingModule { }
