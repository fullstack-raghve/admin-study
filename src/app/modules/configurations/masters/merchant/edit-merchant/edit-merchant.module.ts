import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditMerchantRoutingModule } from './edit-merchant-routing.module';
import { EditMerchantComponent } from './edit-merchant/edit-merchant.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [EditMerchantComponent],
  imports: [
    CommonModule,
    EditMerchantRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditMerchantModule { }
