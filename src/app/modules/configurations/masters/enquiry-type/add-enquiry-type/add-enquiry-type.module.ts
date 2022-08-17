import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEnquiryTypeRoutingModule } from './add-enquiry-type-routing.module';
import { AddEnquiryTypeComponent } from './add-enquiry-type/add-enquiry-type.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddEnquiryTypeComponent],
  imports: [
    CommonModule,
    AddEnquiryTypeRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddEnquiryTypeModule { }
