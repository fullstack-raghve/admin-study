import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewTransactionDetailsRoutingModule } from './view-transaction-details-routing.module';
import { ViewTransactionDetailsComponent } from './view-transaction-details/view-transaction-details.component';
import { SharedModule } from '../../../../../../src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ViewTransactionDetailsComponent],
  imports: [
    CommonModule,
    ViewTransactionDetailsRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class ViewTransactionDetailsModule { }
