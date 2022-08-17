import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddTemplateRoutingModule } from './add-template-routing.module';
import { AddTemplateComponent } from './add-template/add-template.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [AddTemplateComponent],
  imports: [
    CommonModule,
    AddTemplateRoutingModule,
    SharedModule,
    EmojiModule,
    PickerModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
    MatTabsModule,
    EditorModule,
    HttpClientModule,
    MalihuScrollbarModule.forRoot(),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AddTemplateModule { }
