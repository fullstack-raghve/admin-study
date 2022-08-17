import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewAboutUsRoutingModule } from './view-about-us-routing.module';
import { ViewAboutUsComponent } from './view-about-us/view-about-us.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
@NgModule({
  declarations: [ViewAboutUsComponent],
  imports: [
    CommonModule,
    ViewAboutUsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    EditorModule
  ]
})
export class ViewAboutUsModule { }
