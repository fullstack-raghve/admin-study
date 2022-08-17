import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewOrderDetailsRoutingModule } from './view-order-details-routing.module';
import { ViewOrderDetailsComponent } from './view-order-details/view-order-details.component';
import { SharedModule } from '../../../../../../src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
@NgModule({
  declarations: [ViewOrderDetailsComponent],
  imports: [
    CommonModule,
    ViewOrderDetailsRoutingModule,
    SharedModule,
    MatCardModule,
    MatExpansionModule
  ]
})
export class ViewOrderDetailsModule { }
