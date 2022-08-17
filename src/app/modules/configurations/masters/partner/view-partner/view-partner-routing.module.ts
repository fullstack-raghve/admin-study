import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewPartnerComponent } from './view-partner/view-partner.component';
const routes: Routes = [
    { path: '', component: ViewPartnerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewPartnerRoutingModule { }
