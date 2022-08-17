import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveOrdersListingRoutingModule } from './live-orders-listing-routing.module';
import { LiveOrdersListingComponent } from './live-orders-listing/live-orders-listing.component';

import { SharedModule } from '../../../shared/shared.module';
import {MatTabsModule} from '@angular/material';
import { MatTableModule } from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
@NgModule({
  declarations: [LiveOrdersListingComponent],
  imports: [
    CommonModule,
    LiveOrdersListingRoutingModule,
    SharedModule,
    MatTabsModule,
    CdkTableModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatBadgeModule
  ]
})
export class LiveOrdersListingModule { }
