import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditEWalletRoutingModule } from './edit-e-wallet-routing.module';
import { EditEWalletComponent } from './edit-e-wallet/edit-e-wallet.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [EditEWalletComponent],
  imports: [
    CommonModule,
    EditEWalletRoutingModule,
    SharedModule
  ]
})
export class EditEWalletModule { }
