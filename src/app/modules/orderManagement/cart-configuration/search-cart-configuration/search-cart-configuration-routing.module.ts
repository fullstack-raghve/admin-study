import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCartConfigurationComponent } from './search-cart-configuration/search-cart-configuration.component';


const routes: Routes = [
  { path: '', component: SearchCartConfigurationComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCartConfigurationRoutingModule { }
