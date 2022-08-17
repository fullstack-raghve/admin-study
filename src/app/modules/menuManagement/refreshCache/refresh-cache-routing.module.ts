import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefreshCacheComponent } from './refresh-cache/refresh-cache.component';

const routes: Routes = [
  { path: '', component: RefreshCacheComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefreshCacheRoutingModule { }
