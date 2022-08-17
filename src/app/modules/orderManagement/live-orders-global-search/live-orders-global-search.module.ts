import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveOrdersGlobalSearchRoutingModule } from './live-orders-global-search-routing.module';
import { LiveOrdersGlobalSearchComponent } from './live-orders-global-search/live-orders-global-search.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatTableModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LiveOrdersGlobalSearchComponent],
  imports: [
    CommonModule,
    LiveOrdersGlobalSearchRoutingModule,
    SharedModule,
    CdkTableModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule
  ]
})

export class LiveOrdersGlobalSearchModule { }
