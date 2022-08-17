import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCustomerSegmentsRoutingModule } from './edit-customer-segments-routing.module';
import { EditCustomerSegmentsComponent } from './edit-customer-segments/edit-customer-segments.component';


import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import {  MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [EditCustomerSegmentsComponent],
  imports: [
    CommonModule,
    EditCustomerSegmentsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatDialogModule
  ]
})
export class EditCustomerSegmentsModule { }
