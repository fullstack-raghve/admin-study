import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCustomerTypeRoutingModule } from './view-customer-type-routing.module';
import { ViewCustomerTypeComponent } from './view-customer-type/view-customer-type.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ViewCustomerTypeComponent],
  imports: [
    CommonModule,
    ViewCustomerTypeRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ViewCustomerTypeModule { }
