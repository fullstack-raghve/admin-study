import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCardTemplateRoutingModule } from './add-card-template-routing.module';
import { AddCardTemplateComponent } from './add-card-template/add-card-template.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddCardTemplateComponent],
  imports: [
    CommonModule,
    AddCardTemplateRoutingModule,
    SharedModule,
  ]
})
export class AddCardTemplateModule { }
