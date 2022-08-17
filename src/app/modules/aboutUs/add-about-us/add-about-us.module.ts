import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAboutUsRoutingModule } from './add-about-us-routing.module';
import { AddAboutUsComponent } from './add-about-us/add-about-us.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
@NgModule({
  declarations: [AddAboutUsComponent],
  imports: [
    CommonModule,
    AddAboutUsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    EditorModule
  ]
})
export class AddAboutUsModule { }
