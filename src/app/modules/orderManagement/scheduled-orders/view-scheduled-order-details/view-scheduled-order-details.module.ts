import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewScheduledOrderDetailsRoutingModule } from './view-scheduled-order-details-routing.module';
import { ViewScheduledOrderDetailsComponent } from './view-scheduled-order-details/view-scheduled-order-details.component';

import { SharedModule } from '../../../../../../src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ViewScheduledOrderDetailsComponent],
  imports: [
    CommonModule,
    ViewScheduledOrderDetailsRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class ViewScheduledOrderDetailsModule { }
