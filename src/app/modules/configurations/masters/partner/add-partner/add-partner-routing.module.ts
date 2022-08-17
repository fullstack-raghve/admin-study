import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPartnerComponent } from './add-partner/add-partner.component';
const routes: Routes = [
    { path: '', component: AddPartnerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPartnerRoutingModule { }
