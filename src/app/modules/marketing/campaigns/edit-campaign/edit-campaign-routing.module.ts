import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
const routes: Routes = [
    { path: '', component: EditCampaignComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCampaignRoutingModule { }
