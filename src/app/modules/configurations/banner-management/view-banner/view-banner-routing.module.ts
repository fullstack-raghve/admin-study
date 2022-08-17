import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBannerComponent } from './view-banner/view-banner.component';
const routes: Routes = [
    {path:'', component:ViewBannerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewBannerRoutingModule { }