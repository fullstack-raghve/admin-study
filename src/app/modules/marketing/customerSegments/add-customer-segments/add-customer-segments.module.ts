import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCustomerSegmentsRoutingModule } from './add-customer-segments-routing.module';
import { AddCustomerSegmentsComponent } from './add-customer-segments/add-customer-segments.component';

import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import {  MatDialogModule } from '@angular/material';
@NgModule({
  declarations: [AddCustomerSegmentsComponent],
  imports: [
    CommonModule,
    AddCustomerSegmentsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatDialogModule
  ]
})
export class AddCustomerSegmentsModule { }
