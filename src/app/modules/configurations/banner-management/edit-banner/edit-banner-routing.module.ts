import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditBannerComponent } from './edit-banner/edit-banner.component';
const routes: Routes = [
    {path:'', component:EditBannerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditBannerRoutingModule { }