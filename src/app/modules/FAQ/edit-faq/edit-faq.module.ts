import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditFaqRoutingModule } from './edit-faq-routing.module';
import { EditFaqComponent } from './edit-faq/edit-faq.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [EditFaqComponent],
  imports: [
    CommonModule,
    EditFaqRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class EditFaqModule { }
