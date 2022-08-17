import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCardTemplateRoutingModule } from './view-card-template-routing.module';
import { ViewCardTemplateComponent } from './view-card-template/view-card-template.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ViewCardTemplateComponent],
  imports: [
    CommonModule,
    ViewCardTemplateRoutingModule,
    SharedModule
  ]
})
export class ViewCardTemplateModule { }
