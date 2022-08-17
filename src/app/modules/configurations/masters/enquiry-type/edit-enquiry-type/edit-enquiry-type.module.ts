import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditEnquiryTypeRoutingModule } from './edit-enquiry-type-routing.module';
import { EditEnquiryTypeComponent } from './edit-enquiry-type/edit-enquiry-type.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditEnquiryTypeComponent],
  imports: [
    CommonModule,
    EditEnquiryTypeRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditEnquiryTypeModule { }
