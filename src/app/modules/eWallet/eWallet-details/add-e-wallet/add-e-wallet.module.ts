import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEWalletRoutingModule } from './add-e-wallet-routing.module';
import { AddEWalletComponent } from './add-e-wallet/add-e-wallet.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [AddEWalletComponent],
  imports: [
    CommonModule,
    AddEWalletRoutingModule,
    SharedModule,
  ]
})
export class AddEWalletModule { }
