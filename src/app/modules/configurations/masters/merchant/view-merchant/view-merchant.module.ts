import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewMerchantRoutingModule } from './view-merchant-routing.module';
import { ViewMerchantComponent } from './view-merchant/view-merchant.component';
import { SharedModule } from '../../../../../shared/shared.module';
@NgModule({
  declarations: [ViewMerchantComponent],
  imports: [
    CommonModule,
    ViewMerchantRoutingModule,
    SharedModule
  ]
})
export class ViewMerchantModule { }
