import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewTemplateRoutingModule } from './view-template-routing.module';
import { ViewTemplateComponent } from './view-template/view-template.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
@NgModule({
  declarations: [ViewTemplateComponent],
  imports: [
    CommonModule,
    ViewTemplateRoutingModule,
    SharedModule,
    MatCardModule,
    EmojiModule,
    PickerModule,
    FormsModule,
    MatTabsModule,
    MalihuScrollbarModule.forRoot(),
  ]
})
export class ViewTemplateModule { }
