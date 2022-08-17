import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchStoreComponent } from './search-store/search-store.component';
const routes: Routes = [
    {path:'', component:SearchStoreComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchStoreRoutingModule { }
