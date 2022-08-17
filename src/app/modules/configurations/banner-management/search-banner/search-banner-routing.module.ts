import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchBannerComponent } from './search-banner/search-banner.component';
const routes: Routes = [
    {path:'', component:SearchBannerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchBannerRoutingModule { }