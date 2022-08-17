import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewEnquiryTypeRoutingModule } from './view-enquiry-type-routing.module';
import { ViewEnquiryTypeComponent } from './view-enquiry-type/view-enquiry-type.component';

import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ViewEnquiryTypeComponent],
  imports: [
    CommonModule,
    ViewEnquiryTypeRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class ViewEnquiryTypeModule { }
