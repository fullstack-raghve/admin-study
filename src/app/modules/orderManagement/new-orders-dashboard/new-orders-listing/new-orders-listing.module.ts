import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewOrdersListingRoutingModule } from './new-orders-listing-routing.module';
import { NewOrdersListingComponent } from './new-orders-listing/new-orders-listing.component';
import { NewOrdersDetailsComponent } from './new-orders-details/new-orders-details.component';
import { SharedModule } from '../../../../../../src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import { MatBadgeModule } from '@angular/material/badge';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
@NgModule({
  declarations: [NewOrdersListingComponent, NewOrdersDetailsComponent],
  imports: [
    CommonModule,
    NewOrdersListingRoutingModule,
    SharedModule,
    MatCardModule,
    MatExpansionModule,
    MatStepperModule,
    MatBadgeModule,
    ZXingScannerModule
  ]
})
export class NewOrdersListingModule { }
