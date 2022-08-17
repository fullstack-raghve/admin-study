import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewFaqRoutingModule } from './view-faq-routing.module';
import { ViewFaqComponent } from './view-faq/view-faq.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [ViewFaqComponent],
  imports: [
    CommonModule,
    ViewFaqRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewFaqModule { }
