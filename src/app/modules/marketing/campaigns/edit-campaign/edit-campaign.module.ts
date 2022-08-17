import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCampaignRoutingModule } from './edit-campaign-routing.module';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';

import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import {  MatDialogModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
@NgModule({
  declarations: [EditCampaignComponent],
  imports: [
    CommonModule,
    EditCampaignRoutingModule,
    SharedModule,
    MatCardModule,
    EmojiModule,
    PickerModule,
    FormsModule,
    MatDialogModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule,
    MatAutocompleteModule,
    MalihuScrollbarModule.forRoot(),
  ]
})
export class EditCampaignModule { }
