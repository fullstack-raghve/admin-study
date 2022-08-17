import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCustomerSegmentsRoutingModule } from './view-customer-segments-routing.module';
import { ViewCustomerSegmentsComponent } from './view-customer-segments/view-customer-segments.component';

import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';

@NgModule({
  declarations: [ViewCustomerSegmentsComponent],
  imports: [
    CommonModule,
    ViewCustomerSegmentsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewCustomerSegmentsModule { }
