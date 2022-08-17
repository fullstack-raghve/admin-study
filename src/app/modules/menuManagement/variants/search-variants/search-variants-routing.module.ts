import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchVariantsComponent } from './search-variants/search-variants.component';

const routes: Routes = [
  { path:'', component: SearchVariantsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchVariantsRoutingModule { }
