import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCustomerTypeRoutingModule } from './edit-customer-type-routing.module';
import { EditCustomerTypeComponent } from './edit-customer-type/edit-customer-type.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [EditCustomerTypeComponent],
  imports: [
    CommonModule,
    EditCustomerTypeRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditCustomerTypeModule { }
