import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreMenuComponent } from './store-menu/store-menu.component';

const routes: Routes = [
  { path: '', component: StoreMenuComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreMenuRoutingModule { }
