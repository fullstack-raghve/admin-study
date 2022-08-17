import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCustomerTypeRoutingModule } from './add-customer-type-routing.module';
import { AddCustomerTypeComponent } from './add-customer-type/add-customer-type.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [AddCustomerTypeComponent],
  imports: [
    CommonModule,
    AddCustomerTypeRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddCustomerTypeModule { }
