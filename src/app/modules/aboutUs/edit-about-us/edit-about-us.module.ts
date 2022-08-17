import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditAboutUsRoutingModule } from './edit-about-us-routing.module';
import { EditAboutUsComponent } from './edit-about-us/edit-about-us.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [EditAboutUsComponent],
  imports: [
    CommonModule,
    EditAboutUsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    EditorModule
  ]
})
export class EditAboutUsModule { }
