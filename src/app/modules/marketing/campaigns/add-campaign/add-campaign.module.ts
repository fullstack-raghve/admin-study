import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCampaignRoutingModule } from './add-campaign-routing.module';
import { AddCampaignComponent } from './add-campaign/add-campaign.component';

import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
@NgModule({
  declarations: [AddCampaignComponent],
  imports: [
    CommonModule,
    AddCampaignRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
    MatExpansionModule,
    EmojiModule,
    PickerModule,
    MatTabsModule,
    EditorModule,
    MalihuScrollbarModule.forRoot(),
    SelectAutocompleteModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule
  ]
})
export class AddCampaignModule { }
