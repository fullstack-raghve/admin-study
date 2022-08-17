import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCampaignComponent } from './add-campaign/add-campaign.component';
const routes: Routes = [
    { path: '', component: AddCampaignComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCampaignRoutingModule { }
