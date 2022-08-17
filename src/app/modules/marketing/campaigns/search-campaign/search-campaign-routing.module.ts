import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCampaignComponent } from './search-campaign/search-campaign.component';
const routes: Routes = [
    { path: '', component: SearchCampaignComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCampaignRoutingModule { }
