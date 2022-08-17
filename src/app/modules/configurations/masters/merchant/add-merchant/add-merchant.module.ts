import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddMerchantRoutingModule } from './add-merchant-routing.module';
import { AddMerchantComponent } from './add-merchant/add-merchant.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [AddMerchantComponent],
  imports: [
    CommonModule,
    AddMerchantRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddMerchantModule { }
