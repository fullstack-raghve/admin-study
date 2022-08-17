import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCampaignRoutingModule } from './view-campaign-routing.module';
import { ViewCampaignComponent } from './view-campaign/view-campaign.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import {  MatDialogModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [ViewCampaignComponent],
  imports: [
    CommonModule,
    ViewCampaignRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule
  ]
})
export class ViewCampaignModule { }
