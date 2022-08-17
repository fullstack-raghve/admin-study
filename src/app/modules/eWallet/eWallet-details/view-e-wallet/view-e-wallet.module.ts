import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewEWalletRoutingModule } from './view-e-wallet-routing.module';
import { ViewEWalletComponent } from './view-e-wallet/view-e-wallet.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [ViewEWalletComponent],
  imports: [
    CommonModule,
    ViewEWalletRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class ViewEWalletModule { }
