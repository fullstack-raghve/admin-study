import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddFaqRoutingModule } from './add-faq-routing.module';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [AddFaqComponent],
  imports: [
    CommonModule,
    AddFaqRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class AddFaqModule { }
