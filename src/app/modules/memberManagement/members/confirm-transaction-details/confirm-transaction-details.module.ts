import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmTransactionDetailsRoutingModule } from './confirm-transaction-details-routing.module';
import { ConfirmTransactionDetailsComponent } from './confirm-transaction-details/confirm-transaction-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ConfirmTransactionDetailsComponent],
  imports: [
    CommonModule,
    ConfirmTransactionDetailsRoutingModule,
    SharedModule
  ]
})
export class ConfirmTransactionDetailsModule { }
