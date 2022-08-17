import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchBrandComponent } from './search-brand/search-brand.component';

const routes: Routes = [
  {path:'',component:SearchBrandComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchBrandRoutingModule { }
