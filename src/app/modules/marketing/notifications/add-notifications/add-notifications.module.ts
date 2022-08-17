import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddNotificationsRoutingModule } from './add-notifications-routing.module';
import { AddNotificationsComponent } from './add-notifications/add-notifications.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import {  MatDialogModule,MatTableModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  declarations: [AddNotificationsComponent],
  imports: [
    CommonModule,
    AddNotificationsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    EmojiModule,
    PickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule,
    MatTableModule,
    MalihuScrollbarModule.forRoot(),
    MatAutocompleteModule,
    NgxMatSelectSearchModule
  ]
})
export class AddNotificationsModule { }
