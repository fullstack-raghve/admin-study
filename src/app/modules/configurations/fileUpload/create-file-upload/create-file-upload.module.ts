import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateFileUploadRoutingModule } from './create-file-upload-routing.module';
import { CreateFileUploadComponent } from './create-file-upload/create-file-upload.component';

import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';

@NgModule({
  declarations: [CreateFileUploadComponent],
  imports: [
    CommonModule,
    CreateFileUploadRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
  ]
})
export class CreateFileUploadModule { }
