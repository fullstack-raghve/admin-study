import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditTemplateRoutingModule } from './edit-template-routing.module';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
@NgModule({
  declarations: [EditTemplateComponent],
  imports: [
    CommonModule,
    EditTemplateRoutingModule,
    SharedModule,
    MatCardModule,
    EmojiModule,
    PickerModule,
    FormsModule,
    MatDialogModule,
    MatTabsModule,
    EditorModule,
    MalihuScrollbarModule.forRoot(),
  ]
})
export class EditTemplateModule { }
