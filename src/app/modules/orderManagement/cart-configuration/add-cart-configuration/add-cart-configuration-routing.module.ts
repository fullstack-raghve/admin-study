import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCartConfigurationComponent } from './add-cart-configuration/add-cart-configuration.component';

const routes: Routes = [
  { path: '', component: AddCartConfigurationComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCartConfigurationRoutingModule { }
