import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCartConfigurationComponent } from './edit-cart-configuration/edit-cart-configuration.component';

const routes: Routes = [
  { path: '', component: EditCartConfigurationComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCartConfigurationRoutingModule { }
