import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPartnerComponent } from './edit-partner/edit-partner.component';
const routes: Routes = [
    { path: '', component: EditPartnerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditPartnerRoutingModule { }
