import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCardTemplateRoutingModule } from './edit-card-template-routing.module';
import { EditCardTemplateComponent } from './edit-card-template/edit-card-template.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [EditCardTemplateComponent],
  imports: [
    CommonModule,
    EditCardTemplateRoutingModule,
    SharedModule
  ]
})
export class EditCardTemplateModule { }
