import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCartConfigurationComponent } from './view-cart-configuration/view-cart-configuration.component';

const routes: Routes = [
  { path: '', component: ViewCartConfigurationComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCartConfigurationRoutingModule { }
